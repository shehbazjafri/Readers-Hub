<template>
  <div class="mainContainer">
    <div id="searchResults">
      <el-card class="searchMainCard">
        
        <!-- Design for Search Page Starts Here -->
        <el-row>
          <!-- Design for Filter Starts Here -->
          <el-col v-if="books.length != 0 || filterFlag" :span="6" :xs="24" :sm="8" :md="6">
            <el-card shadow="hover" style="margin:10px">
              <h2 style="color: brown">Filter By</h2>

              <el-row class="filterStyle">{{filters.rating.name}}</el-row>
              <el-radio-group v-model="ratingFilter" v-on:change="filterBooks()">
              <el-row v-for="(field, index) in filters.rating.fields" :key="index">
                <el-radio-button :label="filters.rating.fields[index]">
                    <el-rate class="rating"
                      v-model= "filters.rating.fields[index]"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value} and up">
                    </el-rate>
                </el-radio-button>
              </el-row>
              </el-radio-group>
              <el-row class="filterStyle">{{filters.year.name}}</el-row>
              <el-checkbox-group v-model="yearFilter">
              <el-row v-for="(field, index) in filters.year.fields" :key="index">
                <el-checkbox :label="field" v-on:change="filterBooks()">{{field}}</el-checkbox>
              </el-row>
              </el-checkbox-group>

              <el-row class="filterStyle">{{filters.author.name}}</el-row>
              <el-checkbox-group v-model="authorFilter">
              <el-row v-for="(field, index) in filters.author.fields" :key="index">
                <el-checkbox style="text-align: left" :label="field" v-on:change="filterBooks()">{{field}}</el-checkbox>
              </el-row>
              </el-checkbox-group>

              <el-row class="filterStyle">{{filters.genre.name}}</el-row>
              <el-checkbox-group v-model="genreFilter">
              <el-row v-for="(field, index) in filters.genre.fields" :key="index">
                <el-checkbox :label="field" v-on:change="filterBooks()">{{field}}</el-checkbox>
              </el-row>
              </el-checkbox-group>

              <el-row class="filterStyle">{{filters.publisher.name}}</el-row>
              <el-checkbox-group v-model="publisherFilter">
              <el-row v-for="(field, index) in filters.publisher.fields" :key="index">
                <el-checkbox :label="field" v-on:change="filterBooks()">{{field}}</el-checkbox>
              </el-row>
              </el-checkbox-group>
            </el-card>
          </el-col>
          <!-- Design for Filter Ends Here -->

          <div v-if="isSearched && books.length == 0 && !filterFlag" style="text-align: center">
            Your search "<i>{{ searchQuery }}</i>" did not match any books.
            <p>Try something like</p>
            <ul style="list-style-type:none">
              <li>Using more general items.</li>
              <li>Check your spelling.</li>
            </ul>
          </div>
          <div v-else-if="filterFlag">
            Your Filters didn't match any books.
            <p>Try different filters.</p>
          </div>
          <h4 v-else-if="isGenre">Results for books in Genre "<i>{{ searchQuery }}"</i></h4>
          <h4 v-else style="text-align: center">Search Results for "<i>{{ searchQuery }}"</i></h4>

          <!-- Design for Search Results Starts Here -->
          <el-col :span="6" v-for="(book,index) in currentpagearray" :key="index" :xs="24" :sm="8" :md="6">

            <el-card shadow="hover" style="height:300px; margin:10px">
              <img :src= "book.frontCover"  alt="book" height="150px" width="100px"  class="bookImage" @click="seeDetails(book._id)"/>
              <h4 class="bookName" @click="seeDetails(book._id)">{{ book.title }}</h4>
              <h5 class="bookAuthor">by {{ book.author }}</h5>
              <el-rate class="rating"
              v-model= "books[index].averageRating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}">
              </el-rate>
            </el-card>
          </el-col>
          <!-- Design for Search Results Ends Here -->
        </el-row>
        <!-- Design for Search Page Ends Here -->
        <el-pagination v-if="books.length!=0"
          background
          layout="prev, pager, next"
          :total="books.length"
          :page-size="perpage" :current-page.sync="currentpage">
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
import searchService from "../services/searchService.js";
export default {
  name: "SearchPage",
  data() {
    return {
      searchQuery: "",
      filters: {
        rating: {
          name: "Rating",
          fields: [5, 4, 3, 2, 1, 0]
        },
        year: {
          name: "Year",
          fields: [2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010]
        },
        author: {
          name: "Author",
          fields: []
        },
        genre: {
          name: "Genre",
          fields: []
        },
        publisher: {
          name: "Publisher",
          fields: []
        }
      },
      books: [],
      isGenre: false,
      searchArray: [],
      currentpage: 1,
      perpage: 12,
      ratingFilter: 0,
      authorFilter: [],
      yearFilter: [],
      genreFilter: [],
      publisherFilter: [],
      isSearched: false,
      filterFlag:false
    };
  },
  methods: {
    async search() {
      var search = await searchService.search(this.$route.params.searchQuery);
      var g = this.$route.path.split("/").length;
      if(g == 5){
        this.isGenre = true;
      }
      // this.isGenre = this.$route.parmas.genre;
      this.searchQuery = this.$route.params.searchQuery;
      console.log(search.data);
      this.books = search.data.books;
      this.searchArray = search.data.books;
      this.filters.author.fields = [];
      this.filters.publisher.fields = [];
      this.filters.genre.fields = [];
      for (var i = 0; i < search.data.books.length; i++) {
        var book = search.data.books[i];
        if (
          book.author != undefined &&
          !this.filters.author.fields.includes(book.author)
        ) {
          this.filters.author.fields.push(book.author);
        }
        if (
          book.publisher != undefined &&
          !this.filters.publisher.fields.includes(book.publisher)
        ) {
          console.log(book.publisher);
          this.filters.publisher.fields.push(book.publisher);
        }
        for (var genreList in book.genre) {
          if (
            book.genre != undefined &&
            !this.filters.genre.fields.includes(book.genre[genreList])
          ) {
            this.filters.genre.fields.push(book.genre[genreList]);
          }
        }
      }
    },
    filterBooks() {
      console.log("Filter called");
      var filteredArray = this.searchArray;

      if (
        this.authorFilter.length > 0 ||
        this.publisherFilter.length > 0 ||
        this.yearFilter.length > 0 ||
        this.genreFilter.length > 0 ||
        this.ratingFilter != 0
      )
        filteredArray = this.searchArray.filter(this.bookFilter);
        if(filteredArray.length == 0)this.filterFlag=true;
        else this.filterFlag=false;
      this.books = filteredArray;
    },
    bookFilter(book) {
      console.log(this.ratingFilter);
      if (
        (this.authorFilter.length == 0 ||
          this.authorFilter.includes(book.author)) &&
        (this.publisherFilter.length == 0 ||
          this.publisherFilter.includes(book.publisher)) &&
        (this.yearFilter.length == 0 ||
          this.yearFilter.includes(
            parseInt(book.publishedDate.substring(0, 4))
          )) &&
          (this.ratingFilter == 0 || 
            book.averageRating >= this.ratingFilter) &&
          this.filterGenre(book)
      ) {
        return true;
      } else {
        return false;
      }
    },
    filterGenre(book){
      console.log("filterGenre() called:"+book);
      if (this.genreFilter.length == 0) return true;
      else{
        for (var genre of this.genreFilter) {
          if (book.genre.includes(genre)) return true;
        }
        return false;
      }
      
    },
    seeDetails(bookId) {
      this.$router.push({ name: "book-details", params: { id: bookId } });
    },
    loadingScreenOn() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    loadingScreenOff() {
      this.loading.close();
    }
  },
  mounted() {
    this.search();
    this.loadingScreenOn();
  },
  updated() {
    this.loadingScreenOff();
    this.isSearched = true;
  },
  computed: {
    currentpagearray: function() {
      if (this.currentpage == 1) {
        console.log(this.books.slice(0, this.perpage));
        return this.books.slice(0, this.perpage);
      } else {
        return this.books.slice(
          (this.currentpage - 1) * this.perpage,
          this.currentpage * this.perpage
        );
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#searchResults {
  background-color: steelblue;
}
.filterStyle {
  margin: 8px;
  color: skyblue;
  text-decoration: underline;
  font-weight: bold;
}
.bookName,
.bookAuthor,
h4 {
  margin: 0px;
}
.bookName {
  color: brown;
}
.bookName:hover {
  cursor: pointer;
  color: steelblue;
}
.bookAuthor {
  color: cadetblue;
}
.searchMainCard {
  min-height: 600px;
  margin-left: 20px;
  margin-right: 20px;
}
.bookImage {
  padding-bottom: 10px;
}
.bookImage:hover {
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
