<script setup>
import { reactive } from "vue";

const data = reactive({ hash: "" });

function go() {
  if (data.hash) {
    window.location.href = "/?hash=" + data.hash;
  }
}
</script>

<template>
  <div class="col-start-2 col-span-4 text-center">
    <div
      class="bg-gradient-to-tr from-white opacity-80 relative z-10 rounded-tr-xl sm:rounded-t-xl lg:rounded-xl shadow-lg lg:-mr-8 xl:mr-4"
    >
      <article class="text-gray-600 leading-6">
        <dl
          class="transition-opacity duration-1500 delay-500 flex flex-wrap divide-y divide-gray-200"
        >
          <div class="w-full flex-none flex items-baseline px-4 sm:px-6 py-4">
            <dt
              class="flex-none text-xs sm:text-sm font-semibold tracking-wide"
            >
              Transaction Hash:
            </dt>
            <dd class="text-sm sm:text-base pl-2 w-full">
              <input
                type="text"
                v-model="data.hash"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </dd>
            <dd class="text-sm sm:text-base pl-2 w-32">
              <button type="button" class="btn btn--primary" @click="go">
                GO Mint
              </button>
            </dd>
          </div>
        </dl>
      </article>
    </div>
  </div>
</template>
