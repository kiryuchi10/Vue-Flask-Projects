<template>
  <v-app>
    <v-container fluid>
      <!-- Header -->
      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>
          <img src="@/assets/logo.png" alt="App Logo" height="40">
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-app-bar-nav-icon @click="showMenu = !showMenu"></v-app-bar-nav-icon>
      </v-app-bar>

      <!-- Drawer Menu -->
      <v-navigation-drawer v-model="drawer" app>
        <v-list dense>
          <v-list-item-group>
            <v-list-item @click="navigateTo('home')">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="navigateTo('profile')">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Add more menu items as needed -->
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Banner -->
      <v-carousel
        cycle
        hide-delimiter-background
        height="400px"
        :items="bannerItems"
      >
        <v-carousel-item
          v-for="item in bannerItems"
          :key="item.src"
          :src="item.src"
        >
          <v-container fill-height>
            <v-layout
              align-center
              justify-center
              column
              class="text-center"
            >
              <v-flex>
                <v-card class="pa-5" outlined>
                  <v-card-title class="headline">{{ item.title }}</v-card-title>
                  <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
                  <v-card-actions>
                    <v-btn color="primary" @click="readMore(item.link)">Read More</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-carousel-item>
      </v-carousel>

      <!-- Main Content -->
      <v-container>
        <!-- Top Stories -->
        <v-row>
          <v-col
            v-for="story in topStories"
            :key="story.id"
            cols="12"
            md="4"
          >
            <v-card>
              <v-img :src="story.image" height="200px"></v-img>
              <v-card-title>{{ story.title }}</v-card-title>
              <v-card-subtitle>{{ story.summary }}</v-card-subtitle>
              <v-card-actions>
                <v-btn @click="readMore(story.link)">Read More</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Trending Now -->
        <v-divider></v-divider>
        <v-subheader>Trending Now</v-subheader>
        <v-list>
          <v-list-item
            v-for="trend in trendingNow"
            :key="trend.id"
            @click="readMore(trend.link)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ trend.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- Recommended For You -->
        <v-divider></v-divider>
        <v-subheader>Recommended For You</v-subheader>
        <v-row>
          <v-col
            v-for="recommendation in recommendations"
            :key="recommendation.id"
            cols="12"
            md="4"
          >
            <v-card>
              <v-img :src="recommendation.image" height="200px"></v-img>
              <v-card-title>{{ recommendation.title }}</v-card-title>
              <v-card-subtitle>{{ recommendation.summary }}</v-card-subtitle>
              <v-card-actions>
                <v-btn @click="readMore(recommendation.link)">Read More</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Footer -->
      <v-footer app>
        <v-container>
          <v-row>
            <v-col>
              <v-list dense>
                <v-list-item @click="navigateTo('about')">
                  <v-list-item-content>About Us</v-list-item-content>
                </v-list-item>
                <v-list-item @click="navigateTo('contact')">
                  <v-list-item-content>Contact Us</v-list-item-content>
                </v-list-item>
                <!-- Add more footer links as needed -->
              </v-list>
            </v-col>
            <v-col class="text-right">
              <v-btn @click="subscribeNewsletter">Subscribe to Newsletter</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      showMenu: false,
      search: '',
      bannerItems: [
        { src: 'https://via.placeholder.com/800x400', title: 'Featured Story 1', subtitle: 'Subtitle for story 1', link: '#' },
        { src: 'https://via.placeholder.com/800x400', title: 'Featured Story 2', subtitle: 'Subtitle for story 2', link: '#' }
        // Add more items as needed
      ],
      topStories: [
        { id: 1, title: 'Top Story 1', summary: 'Summary for top story 1', image: 'https://via.placeholder.com/300x200', link: '#' },
        { id: 2, title: 'Top Story 2', summary: 'Summary for top story 2', image: 'https://via.placeholder.com/300x200', link: '#' }
        // Add more stories as needed
      ],
      trendingNow: [
        { id: 1, title: 'Trending Story 1', link: '#' },
        { id: 2, title: 'Trending Story 2', link: '#' }
        // Add more trending items as needed
      ],
      recommendations: [
        { id: 1, title: 'Recommended Story 1', summary: 'Summary for recommended story 1', image: 'https://via.placeholder.com/300x200', link: '#' },
        { id: 2, title: 'Recommended Story 2', summary: 'Summary for recommended story 2', image: 'https://via.placeholder.com/300x200', link: '#' }
        // Add more recommendations as needed
      ]
    };
  },
  methods: {
    navigateTo(page) {
      // Implement navigation logic here
      console.log(`Navigating to ${page}`);
    },
    readMore(link) {
      // Implement read more logic here
      console.log(`Reading more at ${link}`);
    },
    subscribeNewsletter() {
      // Implement newsletter subscription logic here
      console.log('Subscribing to newsletter');
    }
  }
};
</script>

<style scoped>
.v-footer {
  background-color: #f5f5f5;
}
</style>
