import { ReactNode } from "react";
import {
  StyleSheet,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: ReactNode;
}

export default function ScreenContainer({
  children,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Fire Glow Left */}
      <View style={styles.leftGlow} />

      {/* Fire Glow Right */}
      <View style={styles.rightGlow} />

      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1013",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  logo: {
    width: 95,
    height: 95,
    marginBottom: 25,
  },

  leftGlow: {
    position: "absolute",
    left: -80,
    top: "25%",
    width: 170,
    height: 300,
    borderRadius: 180,
    backgroundColor: "#FF6A00",
    opacity: 0.12,
  },

  rightGlow: {
    position: "absolute",
    right: -80,
    bottom: "15%",
    width: 170,
    height: 300,
    borderRadius: 180,
    backgroundColor: "#FF8A00",
    opacity: 0.10,
  },
});