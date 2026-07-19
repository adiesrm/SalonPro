import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ServiceDetailsScreen from "../screens/ServiceDetailsScreen";
import BarberSelectionScreen from "../screens/BarberSelectionScreen";
import DateTimeSelectionScreen from "../screens/DateTimeSelectionScreen";
import BookingConfirmationScreen from "../screens/BookingConfirmationScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  MyBookings: undefined;
  Profile:undefined;
  ServiceDetails: {
    service?: {
      name: string;
      category: string;
      price: string;
      duration: string;
      description: string;
      whatsIncluded: string[];
    };
  } | undefined;
  BarberSelection: {
  service: {
    name: string;
    category: string;
    price: string;
    duration: string;
    description: string;
    whatsIncluded: string[];
  };
};

DateTimeSelection: {
  service: {
    name: string;
    category: string;
    price: string;
    duration: string;
    description: string;
    whatsIncluded: string[];
  };
  barber: {
    id: string;
    name: string;
    role: string;
    rating: string;
  };
};

BookingConfirmation: {
service: {
  name: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  whatsIncluded: string[];
};
  barber: {
    id: string;
    name: string;
    role: string;
    rating: string;
  };
  date: string;
  time: string;
  

};
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ScreenProps {
  navigation: NavigationProp;
}

interface ServiceDetailsRouteProps {
  navigation: NavigationProp;
  route: RouteProp<RootStackParamList, "ServiceDetails">;
}
interface BarberSelectionRouteProps {
  navigation: NavigationProp;
  route: RouteProp<RootStackParamList, "BarberSelection">;
}
interface DateTimeSelectionRouteProps {
  navigation: NavigationProp;
  route: RouteProp<RootStackParamList, "DateTimeSelection">;
}
interface BookingConfirmationRouteProps {
  navigation: NavigationProp;
  route: RouteProp<RootStackParamList, "BookingConfirmation">;
}
const Stack = createNativeStackNavigator<RootStackParamList>();

// Premium Service details lookup based on user selection
const getServiceDetails = (serviceName: string) => {
  switch (serviceName) {
    case "The Royal Grooming Ritual":
      return {
        name: "The Royal Grooming Ritual",
        category: "Signature Experience",
        price: "₹2,499",
        duration: "75 min",
        description:
          "Our ultimate signature experience crafted for the modern gentleman. This curated ritual includes a precision bespoke haircut tailored to your features, followed by an artisanal hot towel shave with infused botanical essential oils, a detoxifying charcoal facial massage, and a revitalizing hair spa treatment.",
        whatsIncluded: [
          "Bespoke precision haircut & custom styling design",
          "Traditional hot towel wet shave with premium pre-shave elixir",
          "Detoxifying facial massage & revitalizing scalp therapy",
        ],
      };
    case "Executive Beard & Sculpting":
      return {
        name: "Executive Beard & Sculpting",
        category: "Beard Styling",
        price: "₹1,249",
        duration: "35 min",
        description:
          "A comprehensive beard styling and contouring ritual. Our master barbers sculpt your beard to match your facial structure perfectly, followed by a hot steam razor shave to define razor-sharp lines, and application of premium luxury beard oils.",
        whatsIncluded: [
          "Beard sculpting, trimming & precision styling",
          "Hot towel razor line definition with cooling treatment",
          "Infusion of gold-standard nourishing beard oils",
        ],
      };
    case "Vapor Detox Facial":
      return {
        name: "Vapor Detox Facial",
        category: "Facial Treatment",
        price: "₹1,899",
        duration: "45 min",
        description:
          "Revitalize your skin with our cellular vapor detox treatment. Using advanced steam infusion technology, we deep-cleanse pores, perform a gentle exfoliation, and apply a premium charcoal mask accompanied by a relaxing acupressure facial massage.",
        whatsIncluded: [
          "Deep steam pore extraction & exfoliation",
          "Premium active charcoal detox mask application",
          "Rejuvenating face & neck acupressure massage",
        ],
      };
    case "Haircut":
      return {
        name: "Bespoke Royal Haircut",
        category: "Signature Haircut",
        price: "₹999",
        duration: "45 min",
        description:
          "A personalized consultation and premium haircut tailored specifically to your hair type and style preferences. Completed with an oil-infused scalp massage, relaxing hair wash, and style utilizing our gold-standard styling pomades.",
        whatsIncluded: [
          "Personalized professional hair styling consultation",
          "Precision haircut, neck shaving, & textured finish",
          "Premium shampoo, conditioning & master-designed finish",
        ],
      };
    case "Beard Styling":
      return {
        name: "Signature Beard Styling",
        category: "Beard Care",
        price: "₹799",
        duration: "30 min",
        description:
          "Tame, sculpt, and nourish your beard. This signature service delivers sharp, clean definition, symmetrical alignment, and premium conditioning using traditional organic grooming elixirs.",
        whatsIncluded: [
          "Symmetrical alignment & custom beard sculpting",
          "Pre-shave oil therapy & deep conditioning treatment",
          "Hot towel finish with signature luxury cologne",
        ],
      };
    case "Facial":
      return {
        name: "Prestige Glow Facial",
        category: "Skin Rejuvenation",
        price: "₹1,499",
        duration: "45 min",
        description:
          "Bring instant brightness and hydration to your skin. Designed specifically for active gentlemen, this facial eliminates fatigue lines, hydrates deep tissues, and restores your natural refreshed glow.",
        whatsIncluded: [
          "Instant glow skin exfoliation & cleansing",
          "Rehydrating luxury serum infusion",
          "Cold towel pore tightening & soothing moisturization",
        ],
      };
    case "Hair Spa":
      return {
        name: "Revitalizing Hair Spa",
        category: "Hair & Scalp Care",
        price: "₹1,999",
        duration: "60 min",
        description:
          "An intensive nourishing therapy for hair and scalp health. Perfect for combating daily environmental stress, featuring deep conditioning creams, restorative hair masks, and hot oil head massage.",
        whatsIncluded: [
          "Deep nourishing conditioning masque & repair therapy",
          "Hot essential oil head, neck & shoulder massage",
          "Steam treatment & mineral-infused clarifying rinse",
        ],
      };
    default:
      return undefined;
  }
};

export default function AppNavigator() {
  return (
    <Stack.Navigator
    
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      
      <Stack.Screen name="Welcome">
        {({ navigation }: ScreenProps) => (
          <WelcomeScreen
            onGetStarted={() => navigation.navigate("Login")}
            onSignIn={() => navigation.navigate("Login")}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {({ navigation }: ScreenProps) => (
          <LoginScreen
            onBack={() => navigation.goBack()}
            onSignIn={(credentials) => {
              console.log("Sign In attempted with:", credentials);
              navigation.navigate("Home");
            }}
            onCreateAccount={() => {
              navigation.navigate("Register");
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {({ navigation }: ScreenProps) => (
          <RegisterScreen
            onBack={() => navigation.goBack()}
            onSignInPress={() => navigation.navigate("Login")}
            onAccountCreated={() => {
              navigation.navigate("Home");
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Home">
        {({ navigation }: ScreenProps) => (
          <HomeScreen
            onNavigateToBookings={() => {
  navigation.navigate("MyBookings");
}}
            onNavigateToProfile={() => {
  navigation.navigate("Profile");
}}
            onSelectService={(serviceName) => {
              console.log("Selected service:", serviceName);
              const details = getServiceDetails(serviceName);
              navigation.navigate("ServiceDetails", details ? { service: details } : undefined);
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ServiceDetails">
        {({ navigation, route }: ServiceDetailsRouteProps) => (
          
          <ServiceDetailsScreen
            onBack={() => navigation.goBack()}
            onBookNow={() => {
  if (route.params?.service) {
    navigation.navigate("BarberSelection", {
      service: route.params.service,
    });
  }
}}
            service={route.params?.service}
          />
        )}
      </Stack.Screen>
  <Stack.Screen name="BarberSelection">
  {({ navigation, route }: BarberSelectionRouteProps) => (
    <BarberSelectionScreen
      service={route.params.service}
      onBack={() => navigation.goBack()}
      onContinue={(selectedBarber) => {
  navigation.navigate("DateTimeSelection", {
    service: route.params.service,
    barber: selectedBarber,
  });
}}
/>
  )}
</Stack.Screen>
      <Stack.Screen name="DateTimeSelection">
  {({ navigation, route }: DateTimeSelectionRouteProps) => (
    <DateTimeSelectionScreen
      onBack={() => navigation.goBack()}
      onConfirmBooking={(selectedDate, selectedTime) => {
        navigation.navigate("BookingConfirmation", {
          service: route.params.service,
          barber: route.params.barber,
          date: selectedDate,
          time: selectedTime,
        });
      }}
    />
  )}
</Stack.Screen>

<Stack.Screen name="BookingConfirmation">
  {({ navigation, route }: BookingConfirmationRouteProps) => (
    <BookingConfirmationScreen
      onReturnHome={() => {
        navigation.navigate("Home");
      }}
      bookingDetails={{
  service: route.params.service,
  barber: route.params.barber,
  date: route.params.date,
  time: route.params.time,
}}
    />
  )}
  </Stack.Screen>
  <Stack.Screen
  name="MyBookings"
  component={MyBookingsScreen}
/>
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
/>
    </Stack.Navigator>
    
  );
}