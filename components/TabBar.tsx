import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export const TabBar = () => {
  return (
    <View className="h-20 bg-white border-t border-gray-200">
      <View className="flex-row justify-around items-center h-full pb-4">
        <TouchableOpacity className="items-center">
          <Image
            source={require("../assets/home-icon.png")}
            className="w-6 h-6 mb-1"
          />
          <Text className="text-xs text-gray-600">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Image
            source={require("../assets/quotes-icon.png")}
            className="w-6 h-6 mb-1"
          />
          <Text className="text-xs text-gray-600">Quotes</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center">
            <Image
              source={require("../assets/settings-icon.png")}
              className="w-6 h-6"
              tintColor="white"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
