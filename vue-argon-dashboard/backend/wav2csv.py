# wav2csv.py

import os
from scipy.io import wavfile
import pandas as pd

def convert_wav_to_csv(input_filepath, output_directory):
    if not input_filepath.endswith('.wav'):
        raise ValueError('Input File format should be *.wav')

    samrate, data = wavfile.read(input_filepath)
    print('Load is Done! \n')

    wavData = pd.DataFrame(data)
    output_files = []

    if len(wavData.columns) == 2:
        print('Stereo .wav file\n')
        wavData.columns = ['R', 'L']
        stereo_R = pd.DataFrame(wavData['R'])
        stereo_L = pd.DataFrame(wavData['L'])
        print('Saving...\n')
        output_file_r = os.path.join(output_directory, os.path.basename(input_filepath)[:-4] + "_Output_stereo_R.csv")
        output_file_l = os.path.join(output_directory, os.path.basename(input_filepath)[:-4] + "_Output_stereo_L.csv")
        stereo_R.to_csv(output_file_r, mode='w')
        stereo_L.to_csv(output_file_l, mode='w')
        output_files.extend([output_file_r, output_file_l])
        print(f'Save is done {output_file_r}, {output_file_l}')

    elif len(wavData.columns) == 1:
        print('Mono .wav file\n')
        wavData.columns = ['M']
        output_file = os.path.join(output_directory, os.path.basename(input_filepath)[:-4] + "_Output_mono.csv")
        wavData.to_csv(output_file, mode='w')
        output_files.append(output_file)
        print(f'Save is done {output_file}')

    else:
        print('Multi channel .wav file\n')
        print(f'Number of channels: {len(wavData.columns)}\n')
        output_file = os.path.join(output_directory, os.path.basename(input_filepath)[:-4] + "_Output_multi_channel.csv")
        wavData.to_csv(output_file, mode='w')
        output_files.append(output_file)
        print(f'Save is done {output_file}')

    return output_files
