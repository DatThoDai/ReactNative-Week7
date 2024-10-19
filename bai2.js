import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const MasterScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [donuts, setDonuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonuts = async () => {
      try {
        const response = await fetch('https://6710fa904eca2acdb5f30afb.mockapi.io/tasks2');
        const data = await response.json();
        setDonuts(data);
      } catch (err) {
        setError('Failed to load donuts');
      } finally {
        setLoading(false);
      }
    };
    fetchDonuts();
  }, []);

  const filteredDonuts = donuts.filter(donut =>
    donut.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDonutItem = ({ item }) => (
    <TouchableOpacity
      style={styles.donutItem}
      onPress={() => navigation.navigate('Detail', { donut: item })}
    >
      <Image source={{ uri: item.image }} style={styles.donutImage} />
      <View style={styles.donutInfo}>
        <Text style={styles.donutName}>{item.name}</Text>
        <Text style={styles.donutDescription}>Spicy tasty donut family</Text>
        <Text style={styles.donutPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Image source={require('./images/plus_button.png')} style={styles.addIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F1B000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, Jala!</Text>
      <Text style={styles.title}>Choice you Best food</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity style={styles.searchIconContainer}>
          <Image source={require('./images/search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDonuts}
        renderItem={renderDonutItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const DetailScreen = ({ route, navigation }) => {
  const { donut } = route.params;
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    try {
      const response = await fetch('https://67126da56c5f5ced66237d06.mockapi.io/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donutId: donut.id,
          quantity: quantity,
          name: donut.name,
          price: donut.price,
          image: donut.image,
        }),
      });
      if (response.ok) {
        alert(`Đã thêm ${quantity} ${donut.name} vào giỏ hàng`);
      } else {
        throw new Error('Không thể thêm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.detailContainer}>
      <Image source={{ uri: donut.image }} style={styles.detailImage} />
      <View style={styles.detailInfo}>
        <Text style={styles.detailName}>{donut.name}</Text>
        <Text style={styles.detailDescription}>Spicy tasty donut family</Text>
        <Text style={styles.detailPrice}>${donut.price.toFixed(2)}</Text>
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryLabel}>Delivery</Text>
        <View style={styles.deliveryTime}>
          <Image source={require('./images/clock.png')} style={styles.clockIcon} />
          <Text style={styles.deliveryText}>30 min</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

      <View style={styles.restaurantInfoContainer}>
        <Text style={styles.restaurantInfoTitle}>Restaurant info</Text>
        <Text style={styles.restaurantInfoText}>
          Order a Large Pizza but the size is the equivalent of a medium/small from other places at the same price range.
        </Text>
      </View>
      <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
        <Text style={styles.addToCartText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Master" component={MasterScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  welcome: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: 'white',
  },
  searchIconContainer: {
    backgroundColor: '#F1B000',
    padding: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  donutItem: {
    flexDirection: 'row',
    backgroundColor: '#F4DDDD',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  donutImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  donutInfo: {
    flex: 1,
    marginLeft: 10,
  },
  donutName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  donutDescription: {
    fontSize: 14,
    color: 'gray',
  },
  donutPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    justifyContent: 'center',
  },
  addIcon: {
    width: 30,
    height: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  detailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  detailInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailDescription: {
    fontSize: 16,
    color: 'gray',
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deliveryInfo: {
    marginBottom: 15,
  },
  deliveryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  deliveryText: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginLeft:150,
  },
  quantityButton: {
    backgroundColor: '#F1B000',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth:1,
    borderColor: "black",
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    paddingHorizontal: 20,
  },
  restaurantInfoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  restaurantInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  restaurantInfoText: {
    fontSize: 14,
    textAlign: 'left',
  },
  addToCartButton: {
    backgroundColor: '#F1B000',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'stretch',
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
