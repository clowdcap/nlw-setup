import { ActivityIndicator, View } from "react-native"
import { StyleSheet } from 'react-native'

export const Loading = () => {
  return (
    <View style={styles.loadingView} >
        <ActivityIndicator color="#7C3AED"/>
    </View>
  )
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#09090A",
    }

  })
  