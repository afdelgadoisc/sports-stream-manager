import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  scrollView: {
    backgroundColor: "#fff",
    width: "95%",
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
    marginBottom: 5,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divider: {
    backgroundColor: "#000",
    padding: 1,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 30,
  },
  tinyLogo: {
    width: 400,
    height: 120,
  },
});
