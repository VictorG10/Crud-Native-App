import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { data } from "@/data/todos";
import { ThemeContext } from "@/context/ThemeContext";

import Octicons from "@expo/vector-icons/Octicons";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse : null;

        if (storageTodos && storageTodos.length) {
          setTodos(data.sort((a, b) => b.id - a.id));
        } else {
          setTodos(data.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [data]);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (error) {
        console.error(error);
      }
    };
    storeData();
  }, [todos]);

  const styles = createStyles(theme, colorScheme);

  // Create
  const addTodo = () => {
    const newId = todos.length > 0 ? todos[0].id + 1 : 1;

    text.trim() !== ""
      ? (setTodos((t) => [...t, { id: newId, title: text, completed: false }]),
        setText(""))
      : null;
  };

  const handlePress = (id) => {
    router.push(`todos/${id}`);
  };

  // Render
  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Pressable
        onPress={() => handlePress(item.id)}
        onLongPress={() => toggleTodo(item.id)}
      >
        <Text style={[styles.todoText, item.completed && styles.completedText]}>
          {item.title}
        </Text>
      </Pressable>
      <Pressable style={styles.todoButton} onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons
          name="delete-circle"
          size={36}
          color="red"
          selectable={undefined}
        />
      </Pressable>
    </View>
  );

  // Update
  const toggleTodo = (id) => {
    setTodos((t) =>
      t.map((todo) =>
        todo.id === id ? { ...t, completed: !todo.completed } : todo
      )
    );
  };

  // Delete
  const removeTodo = (index) => {
    setTodos((t) => t.filter((t) => t.id !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Add new Todo..."
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={{ marginLeft: 10 }}
        >
          {colorScheme === "dark" ? (
            <Octicons
              name="moon"
              size={36}
              color={theme.text}
              selectable={undefined}
              style={{ width: 36 }}
            />
          ) : (
            <Octicons
              name="sun"
              size={36}
              color={theme.text}
              selectable={undefined}
              style={{ width: 36 }}
            />
          )}
        </Pressable>
      </View>

      <Animated.FlatList
        data={todos}
        keyExtractor={(todo) => todo.id}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
};

export default Index;

const createStyles = (theme, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      padding: 10,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
      padding: 10,
      borderBottomColor: "gray",
      borderBottomWidth: 1,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      color: theme.text,
    },
    todoButton: {},
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    },
  });
};
