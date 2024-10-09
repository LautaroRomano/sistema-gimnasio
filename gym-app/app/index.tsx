import React from "react";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      <ExpoStatusBar style="light" backgroundColor="#181818"/>
      <WebView 
        source={{ uri: "http://192.168.0.46:3000" }} 
        style={{ flex: 1 }} 
      />
    </SafeAreaView>
  );
}
