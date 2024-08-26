import os
import joblib
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from tensorflow.keras.layers import ( # type: ignore
    Dense,
    Conv1D,
    Flatten,
    Dropout,
    Activation,
    MaxPooling1D,
    BatchNormalization,
    LSTM,
)
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.utils import plot_model,to_categorical # type: ignore
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier


def mlp_classifier(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    mlp_model = MLPClassifier(
        hidden_layer_sizes=(100,),
        solver="adam",
        alpha=0.001,
        shuffle=True,
        verbose=True,
        momentum=0.8,
    )
    mlp_model.fit(X_train, y_train)

    mlp_pred = mlp_model.predict(X_test)
    mlp_accuracy = mlp_model.score(X_test, y_test)
    print("Accuracy: {:.2f}%".format(mlp_accuracy * 100))  # 47.57%

    mlp_clas_report = pd.DataFrame(
        classification_report(y_test, mlp_pred, output_dict=True)
    ).transpose()
    mlp_clas_report.to_csv("features/mlp_clas_report.csv")
    print(classification_report(y_test, mlp_pred))


def lstm_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    X_train_lstm = np.expand_dims(X_train, axis=2)
    X_test_lstm = np.expand_dims(X_test, axis=2)

    lstm_model = Sequential()
    lstm_model.add(LSTM(64, input_shape=(X_train_lstm.shape[1], 1), return_sequences=True))
    lstm_model.add(LSTM(32))
    lstm_model.add(Dense(32, activation="relu"))
    lstm_model.add(Dropout(0.1))
    lstm_model.add(Dense(8, activation="softmax"))

    lstm_model.compile(
        optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"]
    )

    lstm_model.summary()

    # Train model
    lstm_history = lstm_model.fit(X_train_lstm, y_train, batch_size=32, epochs=100)

    # Evaluate model on test set
    test_loss, test_acc = lstm_model.evaluate(X_test_lstm, y_test, verbose=2)
    print("\nTest accuracy:", test_acc)

    # Plot accuracy/loss for training
    plt.plot(lstm_history.history["loss"])
    plt.title("LSTM model loss")
    plt.ylabel("loss")
    plt.xlabel("epoch")
    plt.savefig("images/lstm_loss.png")
    plt.close()

    plt.plot(lstm_history.history["accuracy"])
    plt.title("LSTM model accuracy")
    plt.ylabel("accuracy")
    plt.xlabel("epoch")
    plt.savefig("images/lstm_accuracy.png")
    plt.close()


def cnn_model(X, y):
    # One-hot encode the labels
    y = to_categorical(y, num_classes=8)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    x_traincnn = np.expand_dims(X_train, axis=2)
    x_testcnn = np.expand_dims(X_test, axis=2)

    model = Sequential()
    model.add(Conv1D(16, 5, padding="same", input_shape=(40, 1)))
    model.add(Activation("relu"))
    model.add(Conv1D(8, 5, padding="same"))
    model.add(Activation("relu"))
    model.add(Conv1D(8, 5, padding="same"))
    model.add(Activation("relu"))
    model.add(BatchNormalization())
    model.add(Flatten())
    model.add(Dense(8))
    model.add(Activation("softmax"))

    model.compile(
        loss="categorical_crossentropy",
        optimizer="adam",  # rmsprop
        metrics=["accuracy"],
    )

    cnn_history = model.fit(
        x_traincnn,
        y_train,
        batch_size=50,  # 100
        epochs=100,  # 50
        validation_data=(x_testcnn, y_test),
    )

    # You can comment out the plot_model call if you don't need the visualization
    # plot_model(
    #     model,
    #     to_file="backend/images/cnn_model_summary.png",
    #     show_shapes=True,
    #     show_layer_names=True,
    # )

    # Plot model loss and accuracy
    plt.plot(cnn_history.history["loss"])
    plt.plot(cnn_history.history["val_loss"])
    plt.title("CNN model loss")
    plt.ylabel("loss")
    plt.xlabel("epoch")
    plt.legend(["train", "test"])
    plt.savefig("images/cnn_loss2.png")
    plt.close()

    plt.plot(cnn_history.history["accuracy"])
    plt.plot(cnn_history.history["val_accuracy"])
    plt.title("CNN model accuracy")
    plt.ylabel("accuracy")
    plt.xlabel("epoch")
    plt.legend(["train", "test"])
    plt.savefig("images/cnn_accuracy2.png")

    # Evaluate the model
    cnn_pred = np.argmax(model.predict(x_testcnn), axis=-1)
    y_test_int = np.argmax(y_test, axis=-1)

    matrix = confusion_matrix(y_test_int, cnn_pred)
    print(matrix)

    plt.figure(figsize=(12, 10))
    emotions = [
        "neutral",
        "calm",
        "happy",
        "sad",
        "angry",
        "fearful",
        "disgusted",
        "surprised",
    ]
    cm = pd.DataFrame(matrix)
    ax = sns.heatmap(
        matrix,
        linecolor="white",
        cmap="crest",
        linewidth=1,
        annot=True,
        fmt="",
        xticklabels=emotions,
        yticklabels=emotions,
    )
    bottom, top = ax.get_ylim()
    ax.set_ylim(bottom + 0.5, top - 0.5)
    plt.title("CNN Model Confusion Matrix", size=20)
    plt.xlabel("predicted emotion", size=14)
    plt.ylabel("actual emotion", size=14)
    plt.savefig("images/CNN_confusionmatrix.png")
    plt.show()

    clas_report = pd.DataFrame(
        classification_report(y_test_int, cnn_pred, output_dict=True)
    ).transpose()
    clas_report.to_csv("features/cnn_clas_report.csv")
    print(classification_report(y_test_int, cnn_pred))

    if not os.path.isdir("models"):
        os.makedirs("models")

    model_path = os.path.join("models", "cnn_model.h5")
    model.save(model_path)
    print("Saved trained model at %s " % model_path)


if __name__ == "__main__":
    print("Training started")
    X = joblib.load("features/X.joblib")
    y = joblib.load("features/y.joblib")
    cnn_model(X=X, y=y)
    print("Model finished.")
