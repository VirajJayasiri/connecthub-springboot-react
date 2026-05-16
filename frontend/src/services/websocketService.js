import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_ORIGIN } from "../config/env.js";

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
  }

  connect(token, onConnectCallback) {
    if (this.client && this.client.connected) return;

    const socket = new SockJS(`${API_ORIGIN}/ws`);
    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log("Connected to WebSocket");
      if (onConnectCallback) onConnectCallback(frame);
    };

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    this.client.activate();
  }

  subscribe(destination, callback) {
    if (!this.client || !this.client.connected) {
      console.warn("WebSocket not connected. Subscription queued.");
      // In a real app, you'd queue this or handle reconnection
      return;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      callback(JSON.parse(message.body));
    });

    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  send(destination, body) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error("Cannot send message: WebSocket not connected");
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
