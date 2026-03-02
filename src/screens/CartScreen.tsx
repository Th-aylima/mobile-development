import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  CartItem,
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "../store/cartSlice";

export default function CartScreen() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="bag-outline" size={64} color="#C0C0C0" />
        </View>
        <Text style={styles.emptyTitle}>Sua sacola está vazia</Text>
        <Text style={styles.emptySubtitle}>
          Explore nosso catálogo e adicione produtos incríveis!
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { id: item.id })}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.size}>Tamanho: {item.size}</Text>
        <Text style={styles.price}>
          R$ {(item.price * item.quantity).toFixed(2)}
        </Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() =>
              dispatch(
                updateQuantity({
                  id: item.id,
                  size: item.size,
                  quantity: item.quantity - 1,
                }),
              )
            }
          >
            <Ionicons name="remove" size={18} color="#333" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() =>
              dispatch(
                updateQuantity({
                  id: item.id,
                  size: item.size,
                  quantity: item.quantity + 1,
                }),
              )
            }
          >
            <Ionicons name="add" size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() =>
          dispatch(removeFromCart({ id: item.id, size: item.size }))
        }
      >
        <Ionicons name="trash-outline" size={20} color="#E63946" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.id}-${item.size}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>
              {count} {count === 1 ? "item" : "itens"}
            </Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            activeOpacity={0.9}
            onPress={() => {
              dispatch(clearCart());
              if (Platform.OS === "web") {
                window.alert("Compra finalizada com sucesso! 🎉");
              }
            }}
          >
            <Text style={styles.checkoutText}>Finalizar Compra</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
    padding: 40,
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
  list: {
    padding: 15,
    paddingBottom: 120
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "contain",
    backgroundColor: "#FAFAFA",
  },
  info: {
    flex: 1,
    marginLeft: 14
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4
  },
  size: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    fontWeight: "500"
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F4F5F7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    minWidth: 20,
    textAlign: "center",
  },
  deleteBtn: { padding: 8 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500"
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111"
  },
  checkoutBtn: {
    flexDirection: "row",
    backgroundColor: "#111",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    gap: 8,
    elevation: 4,
    shadowColor: "#111",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
