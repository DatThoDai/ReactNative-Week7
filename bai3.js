import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';


const Stack = createStackNavigator();

const API_URL = 'https://67126da56c5f5ced66237d06.mockapi.io/';
// Welcome Screen
const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Cafe world</Text>
      <Image source={require('./images/jewel.png')} style={styles.image} />
      <Image source={require('./images/javasti.png')} style={styles.image} />
      <Image source={require('./images/phucnguyen.png')} style={styles.image} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ShopsNearMe')}
      >
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
};

// Shops Near Me Screen
const ShopItem = ({ shop, onPress }) => (
  <TouchableOpacity style={styles.shopItem} onPress={onPress}>
    <Image source={shop.image} style={styles.shopImage} />
    <View style={styles.shopInfo}>
      <Text style={styles.shopName}>{shop.name}</Text>
      <Text style={styles.shopAddress}>{shop.address}</Text>
      <View style={styles.shopStatus}>
        {shop.status === 'open' ? (
          <Text style={styles.openText}>✓ Accepting Orders</Text>
        ) : (
          <Text style={styles.closedText}>
            <Image source={require('./images/lock.png')} style={styles.icon} /> Tempory Unavailable
          </Text>
        )}
        <Text style={styles.timeText}>
          <Image source={require('./images/clock.png')} style={styles.icon} /> {shop.time}
        </Text>
        <Image source={require('./images/locate.png')} style={styles.icon} />
      </View>
    </View>
  </TouchableOpacity>
);

const ShopsNearMeScreen = ({ navigation }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch(`${API_URL}/shops`);
      const data = await response.json();
      setShops(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00CED1" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Shops Near Me</Text>
      <Image source={require('./images/search.png')} style={styles.searchIcon} />
      <FlatList
        data={shops}
        renderItem={({ item }) => (
          <ShopItem
            shop={item}
            onPress={() => navigation.navigate('Drinks', { shop: item })}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// Drinks Screen
const DrinkItem = ({ name, price, image }) => (
  <View style={styles.drinkItem}>
    {image && <Image source={image} style={styles.drinkImage} />}
    <View style={styles.drinkInfo}>
      <Text style={styles.drinkName}>{name}</Text>
      <Text style={styles.drinkPrice}>${price}</Text>
    </View>
    <View style={styles.quantityControls}>
      <TouchableOpacity style={styles.quantityButton}>
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quantityButton}>
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const DrinksScreen = ({ navigation, route }) => {
  const { shop } = route.params;
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const response = await fetch('https://6710fa904eca2acdb5f30afb.mockapi.io/drinks');
      const data = await response.json();
      setDrinks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching drinks:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00CED1" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{shop.name} - Drinks</Text>
      <Image source={require('./images/search.png')} style={styles.searchIcon} />
      <FlatList
        data={drinks}
        renderItem={({ item }) => <DrinkItem {...item} />}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.goToCartButton}
        onPress={() => navigation.navigate('YourOrders', { shop: shop })}
      >
        <Text style={styles.goToCartButtonText}>GO TO CART</Text>
      </TouchableOpacity>
    </View>
  );
};

// Your Orders Screen
const OrderItem = ({ name, price, image }) => (
  <View style={styles.orderItem}>
    <Image source={image} style={styles.orderImage} />
    <View style={styles.orderInfo}>
      <Text style={styles.orderName}>{name}</Text>
      <Text style={styles.orderPrice}>${price}</Text>
    </View>
    <View style={styles.quantityControls}>
      <TouchableOpacity style={styles.quantityButton}>
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quantityButton}>
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const YourOrdersScreen = ({ route }) => {
  const { shop } = route.params;
  const orders = [
    { id: '1', name: 'CAFE DELIVERY', price: '5', type: 'delivery' },
    { id: '2', name: 'CAFE', price: '25', type: 'cafe' },
    { id: '3', name: 'Salt', price: '5', image: require('./images/Salt.png') },
    { id: '4', name: 'Weasel', price: '20', image: require('./images/Weasel.png') },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your orders - {shop.name}</Text>
      <Image source={require('./images/search.png')} style={styles.searchIcon} />
      <FlatList
        data={orders}
        renderItem={({ item }) =>
          item.type ? (
            <View style={[styles.orderSummary, item.type === 'delivery' ? styles.deliveryColor : styles.cafeColor]}>
              <View>
                <Text style={styles.orderSummaryText}>{item.name}</Text>
                <Text style={styles.orderSummaryText}>Order #18</Text>
              </View>
              <Text style={styles.orderSummaryPrice}>${item.price}</Text>
            </View>
          ) : (
            <OrderItem {...item} />
          )
        }
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.payNowButton}>
        <Text style={styles.payNowButtonText}>PAY NOW</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main App Component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ShopsNearMe" component={ShopsNearMeScreen} />
        <Stack.Screen name="Drinks" component={DrinksScreen} />
        <Stack.Screen name="YourOrders" component={YourOrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#00CED1',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 30,
    top: 25,
  },
  shopItem: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  shopImage: {
    width: "100%",
    height: 100,
  },
  shopInfo: {
    flex: 1,
    padding: 10,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shopAddress: {
    fontSize: 14,
    color: 'gray',
  },
  shopStatus: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: "space-between",
  },
  openText: {
    color: 'green',
    marginRight: 10,
  },
  closedText: {
    color: 'red',
    marginRight: 10,
  },
  timeText: {
    marginRight: 10,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  drinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  drinkImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  drinkInfo: {
    flex: 1,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  drinkPrice: {
    fontSize: 14,
    color: 'gray',
  },
  quantityControls: {
    flexDirection: 'row',
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: 'green',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  goToCartButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  goToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  deliveryColor: {
    backgroundColor: '#00CED1',
  },
  cafeColor: {
    backgroundColor: '#8A2BE2',
  },
  orderSummaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderSummaryPrice: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  orderImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderPrice: {
    fontSize: 14,
    color: 'gray',
  },
  payNowButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  payNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
});

export default App;