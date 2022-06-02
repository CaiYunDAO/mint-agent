import axios from "axios";

const client = axios.create({
  baseURL: "https://api.opensea.io",
});

/**
 * 根据合约地址获取NFT基础信息
 * @param {*} address
 * @returns
 */
async function getAssetContract(address) {
  return (await client.get(`/api/v1/asset_contract/${address}`)).data;
}

/**
 * 根据NFT名称获取NFT详细信息
 * @param {*} slug
 * @returns
 */
async function getCollection(slug) {
  return (await client.get(`/api/v1/collection/${slug}`)).data;
}

export { getAssetContract, getCollection };
