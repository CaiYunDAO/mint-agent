<script setup>
import Loading from "vue3-loading-overlay";
import { notify } from "@kyvg/vue3-notification";
import { getMethodData } from "../api/etherscan";
import { getAssetContract, getCollection } from "../api/opensea";
import { onMounted, reactive, computed } from "vue";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const data = reactive({
  isLoad: true,
  isMintLoad: false,
  address: "",
  name: "",
  opeansea: "",
  totalSupply: 0,
  floorPrice: 0,
  totalVolume: 0,
  methodAbi: {},
  methodArgs: [],
});

const methodText = computed(() => {
  if (data.methodAbi?.name) {
    return `${data.methodAbi.name}(${data.methodAbi.inputs
      .map((e) => `${e.name} ${e.type}`)
      .join(", ")})`;
  }
  return "";
});

onMounted(async () => {
  const params = new URLSearchParams(location.search);
  const hash = params.get("hash");
  if (!hash) {
    return;
  }

  const provider = new ethers.providers.InfuraProvider(
    "mainnet",
    import.meta.env.VITE_INFURA_API_KEY
  );
  const tx = await provider.getTransaction(hash);
  data.address = tx.to;
  await Promise.all([
    (async () => {
      const methodData = await getMethodData(
        import.meta.env.VITE_ETHERSCAN_API_KEY,
        data.address,
        tx.data
      );
      data.methodAbi = methodData.method;
      data.methodArgs = methodData.args;
    })(),
    (async () => {
      const { collection } = await getAssetContract(data.address);
      if (collection?.slug) {
        data.name = collection.name;
        data.opeansea = `https://opensea.io/collection/${collection.slug}`;
        const { collection: slugCollection } = await getCollection(
          collection.slug
        );
        if (slugCollection?.stats) {
          data.totalSupply = slugCollection?.stats.total_supply;
          data.floorPrice = slugCollection?.stats.floor_price;
          data.totalVolume = slugCollection?.stats.total_volume;
        }
      }
    })(),
  ]);
  data.isLoad = false;
});

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: import.meta.env.VITE_INFURA_API_KEY,
    },
  },
};
const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions,
});

async function freeMint() {
  try {
    data.isMintLoad = true;
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      data.address,
      [data.methodAbi],
      signer
    );
    try {
      await contract[data.methodAbi.name](
        ...data.methodArgs.map((e) => e.value)
      );
      notify({
        type: "success",
        title: "MINT成功，请前往Opensea查看",
      });
    } catch (e) {
      notify({
        type: "warn",
        title: `MINT失败，原因：${e?.error?.message || e?.message}`,
      });
    }
  } finally {
    data.isMintLoad = false;
  }
}
</script>

<template>
  <loading :active="data.isLoad" color="#86A8E7"></loading>
  <div
    class="col-start-2 col-span-4 text-center"
    :class="{ 'blur-sm': data.isLoad }"
  >
    <div
      class="bg-gradient-to-tr from-white opacity-80 relative z-10 rounded-tr-xl sm:rounded-t-xl lg:rounded-xl shadow-lg lg:-mr-8 xl:mr-4"
    >
      <article class="text-gray-600 leading-6">
        <h2
          class="transition-opacity duration-1500 delay-500 text-xl sm:text-2xl font-semibold text-black px-4 py-6 sm:px-6 pb-1"
        >
          {{ data.name }}
        </h2>
        <dl
          class="transition-opacity duration-1500 delay-500 flex flex-wrap divide-y divide-gray-200"
        >
          <div class="w-full flex-none flex items-baseline px-4 sm:px-6 py-4">
            <dt
              class="w-2/5 sm:w-1/3 flex-none uppercase text-xs sm:text-sm font-semibold tracking-wide"
            >
              Opensea
            </dt>
            <dd class="text-black text-sm sm:text-base underline">
              <a :href="data.opeansea || '#'" target="_blank">{{
                data.opeansea
              }}</a>
            </dd>
          </div>
          <div class="w-full flex-none flex items-baseline px-4 sm:px-6 py-4">
            <dt
              class="w-2/5 sm:w-1/3 flex-none uppercase text-xs sm:text-sm font-semibold tracking-wide"
            >
              已铸造数
            </dt>
            <dd class="text-black text-sm sm:text-base">
              {{ data.totalSupply }}
            </dd>
          </div>
          <div class="w-full flex-none flex items-baseline px-4 sm:px-6 py-4">
            <dt
              class="w-2/5 sm:w-1/3 flex-none uppercase text-xs sm:text-sm font-semibold tracking-wide"
            >
              地板价格
            </dt>
            <dd class="text-black text-sm sm:text-base">
              {{ data.floorPrice }} ETH
            </dd>
          </div>
          <div class="w-full flex-none flex items-baseline px-4 sm:px-6 py-4">
            <dt
              class="w-2/5 sm:w-1/3 flex-none uppercase text-xs sm:text-sm font-semibold tracking-wide"
            >
              总交易额
            </dt>
            <dd class="text-black text-sm sm:text-base">
              {{ data.totalVolume }} ETH
            </dd>
          </div>
          <div class="w-full flex-none flex items-baseline px-4 sm:px-6 py-4">
            <dt
              class="w-2/5 sm:w-1/3 flex-none uppercase text-xs sm:text-sm font-semibold tracking-wide"
            >
              ABI
            </dt>
            <dd class="italic text-sm sm:text-base">
              {{ methodText }}
            </dd>
          </div>
          <div
            v-for="(arg, i) in data.methodArgs"
            :key="i"
            class="w-full flex-none flex items-baseline px-4 sm:px-6 py-4"
          >
            <dt
              class="italic w-2/5 sm:w-1/3 flex-none text-xs sm:text-sm font-semibold tracking-wide"
            >
              {{ arg.name }}
            </dt>
            <dd class="italic text-sm sm:text-base">
              <input
                type="text"
                v-model="arg.value"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </dd>
          </div>
        </dl>
        <div class="grid grid-cols-1 p-4 text-center">
          <div>
            <button
              class="btn btn--primary w-1/3"
              :class="{ 'animate-bounce': data.isMintLoad }"
              @click="freeMint"
              :disabled="data.isMintLoad"
            >
              Free Mint
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
