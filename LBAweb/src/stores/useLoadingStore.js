import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useLoadingStore = defineStore("loading", () => {
  // counter of in-flight requests
  const loadingQueue = ref(0);

  // boolean = true whenever there is at least one pending request
  const isLoading = computed(() => loadingQueue.value > 0);

  function add() {
    loadingQueue.value++;
  }
  function remove() {
    loadingQueue.value = Math.max(loadingQueue.value - 1, 0);
  }

  return { loadingQueue, isLoading, add, remove };
});
