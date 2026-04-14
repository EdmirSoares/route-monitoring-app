import { useEffect, useState } from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
  cellularGeneration: string | null;
};

const DEFAULT: NetworkStatus = {
  isConnected: false,
  isInternetReachable: null,
  type: "unknown",
  cellularGeneration: null,
};

function mapState(state: NetInfoState): NetworkStatus {
  const gen =
    state.type === "cellular" && state.details
      ? (state.details as { cellularGeneration?: string | null })
          .cellularGeneration ?? null
      : null;

  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
    cellularGeneration: gen,
  };
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(DEFAULT);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus(mapState(state));
    });

    NetInfo.fetch().then((state) => setStatus(mapState(state)));

    return unsubscribe;
  }, []);

  return status;
}
