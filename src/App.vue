<script setup>
import { onMounted, reactive } from "vue";
import BootstrapIcon from "@dvuckovic/vue3-bootstrap-icons";
import Main from "./components/Main.vue";
import Mint from "./components/Mint.vue";

const data = reactive({
  hash: null,
});

onMounted(async () => {
  const params = new URLSearchParams(location.search);
  data.hash = params.get("hash");
});
</script>

<template>
  <notifications position="bottom right" />
  <div class="container mx-auto pt-10">
    <div class="grid grid-cols-6 gap-4">
      <div class="col-start-2 col-span-4 text-center">
        <p class="font-mono font-black text-6xl text-white text-shadow">
          MINT AGENT
        </p>
      </div>
      <div class="flex fixed right-12">
        <a href="https://twitter.com/JayPlayDota" target="_blank" class="pl-4"
          ><BootstrapIcon icon="twitter" size="2x"
        /></a>
        <a href="https://discord.gg/wV8WTZmPad" target="_blank" class="pl-4"
          ><BootstrapIcon icon="discord" size="2x"
        /></a>
        <a
          href="https://github.com/CaiYunDAO/mint-agent"
          target="_blank"
          class="pl-4"
          ><BootstrapIcon icon="github" size="2x"
        /></a>
      </div>
    </div>
    <div class="grid grid-cols-6 gap-4 pt-24">
      <component :is="data.hash ? Mint : Main" />
    </div>
    <div class="container mx-auto absolute bottom-20">
      <div class="col-start-2 col-span-4 text-center">
        <p class="font-mono font-black text-2xl text-black">
          让你的 MINT 快人一步！
        </p>
      </div>
    </div>
  </div>
</template>
