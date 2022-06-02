import { ethers } from "ethers";
import axios from "axios";

async function getMethodData(apikey, address, inputData) {
  const resp = await axios.get(
    `https://api.etherscan.io/api?module=contract&action=getabi&apikey=${apikey}&address=${address}`
  );
  if (resp.data.status !== "1") {
    return null;
  }
  const abi = JSON.parse(resp.data.result);
  var iface = new ethers.utils.Interface(abi);
  const methodHash = inputData.substring(0, 10);
  const methodKey = Object.keys(iface.functions).find((e) => {
    if (iface.getSighash(iface.functions[e]) === methodHash) {
      return true;
    }
  });
  if (!methodKey) {
    return null;
  }
  const method = iface.functions[methodKey];
  const result = iface.decodeFunctionData(method, inputData);
  return {
    method,
    args: method.inputs.map((e, i) => ({
      name: e.name,
      type: e.type,
      value: result[i].toString(),
    })),
  };
}

export { getMethodData };
