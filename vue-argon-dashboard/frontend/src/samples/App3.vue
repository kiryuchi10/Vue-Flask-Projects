<template>
  <v-app>
    <!-- Top Navigation Bar -->
    <v-app-bar dense color="light-green">
      <v-toolbar-title class="text-h6">앱 설명</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-update</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-ambulance</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-container class="mt-4">
      <!-- Cartoon and Register Button -->
      <v-row>
        <v-col cols="6">
          <v-img src="" contain></v-img>
        </v-col>
        <v-col cols="6" align="center">
          <v-btn large color="light-green" block>
            <v-icon left>mdi-phone</v-icon>
            구호자 전화번호 등록
          </v-btn>
        </v-col>
      </v-row>

      <!-- Contact List -->
      <v-list>
        <!-- Contact Item -->
        <v-list-item-group>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon color="yellow">mdi-star</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>아들</v-list-item-title>
              <v-list-item-subtitle>010 - 1234 - 5678</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn small color="success">수정</v-btn>
              <v-btn small color="error">삭제</v-btn>
            </v-list-item-action>
          </v-list-item>

          <!-- Additional Contacts -->
          <v-list-item>
            <v-list-item-avatar>
              <v-icon color="grey">mdi-account</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>사회복지과 담당자</v-list-item-title>
              <v-list-item-subtitle>070 - 0000 - 0000</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn small color="success">수정</v-btn>
              <v-btn small color="error">삭제</v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-list-item>
            <v-list-item-avatar>
              <v-icon color="grey">mdi-account</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>행복센터 담당자</v-list-item-title>
              <v-list-item-subtitle>070 - 0000 - 0000</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn small color="success">수정</v-btn>
              <v-btn small color="error">삭제</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'WireframeExample',
};
</script>

<style>
.v-app-bar {
  background-image: url('');
  background-size: cover;
}
.v-list-item {
  background-color: white;
  margin-bottom: 10px;
  border-radius: 10px;
}
</style>
