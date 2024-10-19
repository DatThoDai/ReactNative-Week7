import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, Alert } from 'react-native';

const Stack = createStackNavigator();
const API_URL = 'https://6710fa904eca2acdb5f30afb.mockapi.io/tasks';

const WelcomeScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('./images/note.png')} style={styles.image} />
      <Text style={styles.title}>MANAGE YOUR {"\n"} TASK</Text>
      <View style={styles.inputForm}>
        <Image source={require('./images/mail.png')} style={styles.mail} />
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TaskList', { name })}
        >
          <Text style={styles.buttonText}>GET STARTED →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TaskListScreen = ({ route, navigation }) => {
  const { name } = route.params;
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
    if (route.params?.updated) {
      fetchTasks();
    }
  }, [route.params?.updated]);
  

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa công việc này?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          onPress: async () => {
            try {
              await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
              fetchTasks();
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          }
        }
      ]
    );
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Image source={require('./images/people.png')} style={styles.profileImage} />
          <View>
            <Text style={styles.greeting}>Hi {name}</Text>
            <Text style={styles.subGreeting}>Have a great day ahead</Text>
          </View>
        </View>
      </View>
      <View style={styles.inputForm}>
        <Image source={require('./images/search.png')} style={styles.mail} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Image source={require('./images/check.png')} style={styles.taskIcon} />
            <Text style={styles.taskTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Image source={require('./images/delete.png')} style={styles.taskIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddTask', { task: item, isEditing: true })}>
              <Image source={require('./images/pencil.png')} style={styles.taskIcon} />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask', { isEditing: false })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const AddTaskScreen = ({ route, navigation }) => {
  const { task, isEditing } = route.params || {};
  const [jobTitle, setJobTitle] = useState(isEditing ? task.title : '');

  const handleFinish = async () => {
    try {
      if (isEditing) {
        await fetch(`${API_URL}/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: jobTitle })
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: jobTitle })
        });
      }
      navigation.navigate('TaskList', { updated: true });
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={require('./images/people.png')} style={styles.profileImage} />
          <View>
            <Text style={styles.greeting}>Hi Twinkle</Text>
            <Text style={styles.subGreeting}>Have a great day ahead</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.addTaskTitle}>{isEditing ? 'EDIT YOUR JOB' : 'ADD YOUR JOB'}</Text>
      <View style={styles.inputForm}>
        <Image source={require('./images/sheet.png')} style={styles.mail} />
        <TextInput
          style={styles.addTaskInput}
          placeholder="Input your job"
          value={jobTitle}
          onChangeText={setJobTitle}
        />
      </View>
      
      <View style={styles.finishSection}>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinish}
        >
          <Text style={styles.buttonText}>FINISH →</Text>
        </TouchableOpacity>
      </View>

      <Image source={require('./images/note.png')} style={styles.addTaskImage} />
    </View>
  );
};

const App = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B68EE',
    textAlign: 'center',
    marginVertical: 30,
    marginBottom: 50,
  },
  inputForm: {
    flexDirection: "row",
    width: "100%",
  },
  mail: {
    position: "absolute",
    bottom: 35,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    paddingLeft: 40,
  },
  buttonSection: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
  button: {
    backgroundColor: '#40E0D0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',

    width: "50%",
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',

  },
  header: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: "space-between",
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  profileContainer: {

    flexDirection: 'row',
    alignItems: 'center',

  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: 14,
    color: '#999',
  },
  searchInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    paddingLeft: 40,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
  },
  taskIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  taskTitle: {
    flex: 1,
  },
  editButton: {
    fontSize: 18,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 160,
    backgroundColor: '#40E0D0',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  addTaskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addTaskInput: {
    width:"100%",
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    paddingLeft: 40,
  },
  finishSection: {
    width: "100%",
    justifyContent: "center",
    alignItems:"center",
  },
  finishButton: {
    width: "50%",
    backgroundColor: '#40E0D0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 50,
    marginBottom: 90,
  },
  addTaskImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
});

export default App;