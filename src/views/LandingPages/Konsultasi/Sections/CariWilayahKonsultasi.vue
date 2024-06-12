<template>
  <div class="select-container">
    <div class="input-container">
      <input
        type="text"
        class="select-input"
        v-model="searchQuery"
        @click="toggleOptions"
        @input="filterOptions"
        placeholder="Cari wilayah..."
      />
      <i class="fa fa-search search-icon" aria-hidden="true"></i>
    </div>
    <ul v-if="showOptions" class="options-list">
      <li
        v-for="(option, index) in filteredOptions"
        :key="index"
        class="option-item"
        @click="selectOption(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      options: [
        'Provinsi Jawa Timur',
        'Kabupaten Pacitan',
        'Kabupaten Tulungagung',
        'Kota Surabaya',
        'Kota Batu'
      ],
      showOptions: false
    };
  },
  computed: {
    filteredOptions() {
      return this.options.filter(option =>
        option.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    toggleOptions() {
      this.showOptions = !this.showOptions;
    },
    filterOptions(event) {
      this.searchQuery = event.target.value;
      this.showOptions = true;
    },
    selectOption(option) {
      this.searchQuery = option;
      this.showOptions = false;
    }
  }
};
</script>

<style scoped>
.select-container {
  position: relative;
  width: 250px; /* Sesuaikan lebarnya */
}

.input-container {
  position: relative;
}

.select-input {
  width: 100%; /* Sesuaikan lebarnya */
  padding: 8px 30px 8px 8px; /* Sesuaikan paddingnya */
}

.search-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.options-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: calc(100% + 5px); /* Sesuaikan jaraknya */
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 5px 5px;
  background-color: #fff;
  z-index: 1;
}

.option-item {
  padding: 8px;
  cursor: pointer;
}

.option-item:hover {
  background-color: #f0f0f0;
}
</style>
