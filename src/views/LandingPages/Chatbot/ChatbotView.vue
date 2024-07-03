<template>
  <div>
    <NavbarChat
      :action="{
        route: 'javascript:;',
        label: 'Buy Now',
        color: 'btn-white',
      }"
    />
    <div class="chat-layout">
      <Sidebar
        v-if="isSidebarVisible"
        @suggestion-clicked="sendMessageFromSidebar"
        @load-chat="loadChatFromSidebar"
        @new-chat="startNewChat"
        @delete-chat="deleteChat"
        :chats="chats"
      />
      <div class="chat-window">
        <div class="breadcrumb">
          <button @click="toggleSidebar" class="breadcrumb-toggle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24px"
              height="24px"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 7h18v2H3z" />
              <path d="M3 15h13.5v2H3z" />
            </svg>
          </button>
          <span
            v-if="chatSummary"
            class="text-bold"
            style="margin-left: 10px"
            >{{ chatSummary }}</span
          >
        </div>
        <div class="messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message', message.role]"
          >
            <img
              :src="message.role == 'user' ? userAvatar : aiAvatar"
              class="avatar"
            />
            <div class="text" v-html="formatMessage(message.content)"></div>
          </div>
          <div v-if="isLoading" class="message ai">
            <img :src="aiAvatar" class="avatar" />
            <div class="text-italic">
              Tunggu sebentar ya, AIDA sedang mengetik...
            </div>
          </div>
        </div>
        <div class="input-box">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="Ketik curhatanmu ke Ning AIDA (misal: berikan insight tentang Data Kemiskinan) . . ."
          />
          <button @click="sendMessage">Kirim</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarChat from "@/examples/navbars/NavbarChat.vue";
import Sidebar from "./SidebarChat.vue";
import { getAiResponse, getChatSummary } from "@/api/GeminiApi.js";
import { apiService } from "@/api/ApiService.js";

export default {
  name: "ChatbotView",
  components: {
    NavbarChat,
    Sidebar,
  },
  data() {
    return {
      userInput: "",
      messages: [],
      chats: [],
      userAvatar: "",
      aiAvatar:
        "https://res.cloudinary.com/bpsjatim/image/upload/f_auto,q_auto/tzpygq8dcjgr6phg4ny0",
      chatSummary: null,
      isSidebarVisible: true,
      isLoading: false,
      userId: "",
      currentChatId: null, // ID percakapan saat ini
    };
  },
  created() {
    this.loadUserFromLocalStorage();
    this.loadChatsFromApi();
  },
  methods: {
    loadUserFromLocalStorage() {
      const storedUser = localStorage.getItem("user");
      const storedLoggedIn = localStorage.getItem("loggedIn");

      if (storedUser && storedLoggedIn) {
        const parsedUser = JSON.parse(storedUser);
        this.userAvatar = parsedUser.foto;
        this.userId = parsedUser.id;
      }
    },
    async loadChatsFromApi() {
      try {
        const response = await apiService.getAidaByUser(this.userId);
        if (Array.isArray(response.data.data)) {
          this.chats = response.data.data.map((chat) => ({
            id: chat.id,
            summary: chat.resume,
            messages: JSON.parse(chat.conversation),
          }));
          if (this.chats.length > 0) {
            this.loadChatFromSidebar(this.chats[0]);
          }
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    async sendMessageFromSidebar(message) {
      this.messages.push({ role: "user", content: message });
      this.isLoading = true;
      try {
        const aiResponse = await getAiResponse(this.messages);
        this.messages.push({ role: "ai", content: aiResponse });
        this.isLoading = false;
        this.saveMessages();
      } catch (error) {
        console.error("Error fetching AI response:", error);
        this.messages.push({
          role: "ai",
          content: "Sorry, there was an error getting the response.",
        });
        this.isLoading = false;
        this.saveMessages();
      }
    },
    async sendMessage() {
      const message = this.userInput.trim();
      if (!message) return;

      this.messages.push({ role: "user", content: message });
      this.userInput = "";
      this.isLoading = true;
      try {
        const aiResponse = await getAiResponse(this.messages);
        this.messages.push({ role: "ai", content: aiResponse });
        this.isLoading = false;
        this.saveMessages();
      } catch (error) {
        console.error("Error fetching AI response:", error);
        this.messages.push({
          role: "ai",
          content: "Sorry, there was an error getting the response.",
        });
        this.isLoading = false;
        this.saveMessages();
      }
    },
    async saveMessages() {
      try {
        const chatSummary = await this.getChatSummaryIfNotExists();
        const conversation = {
          resume: chatSummary,
          conversation: JSON.stringify(this.messages),
          id_pengguna: this.userId,
        };
        if (this.currentChatId) {
          await apiService.updateAidaConversation(this.currentChatId, conversation);
        } else {
          const response = await apiService.addAida(conversation);
          this.currentChatId = response.data.id;
        }
        await this.updateChatHistories(chatSummary);
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    },
    async getChatSummaryIfNotExists() {
      if (!this.chatSummary && this.messages.length > 0) {
        try {
          this.chatSummary = await getChatSummary(this.messages);
        } catch (error) {
          console.error("Error fetching chat summary:", error);
          this.chatSummary = "Conversation Summary";
        }
      }
      return this.chatSummary;
    },
    loadChatFromSidebar(chat) {
      this.messages = chat.messages;
      this.chatSummary = chat.summary;
      this.currentChatId = chat.id; // Set current chat ID
    },
    async startNewChat() {
      this.messages = [];
      this.chatSummary = null;
      this.currentChatId = null; // Reset current chat ID for new chat
    },
    async deleteChat(chatId) {
      try {
        await apiService.deleteAidaConversation(chatId);
        this.chats = this.chats.filter((chat) => chat.id !== chatId);
        if (this.chats.length == 0) {
          this.startNewChat();
        } else {
          this.loadChatFromSidebar(this.chats[0]);
        }
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    },
    async updateChatHistories(chatSummary) {
      const newChat = { summary: chatSummary, messages: this.messages, id: this.currentChatId };
      this.chats = [
        newChat,
        ...this.chats.filter((chat) => chat.id !== this.currentChatId),
      ];
    },
    formatMessage(message) {
      message = message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      message = message.replace(/\*(.*?)\*/g, "<em>$1</em>");
      message = message.replace(/\n/g, "<br>");
      message = message.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>'
      );
      message = message.replace(/^\d+\.\s/gm, (match) => `<br>${match}`);
      return message;
    },
  },
};
</script>


<style scoped>
.chat-layout {
  display: flex;
  height: 100vh;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 100vh;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message.user .avatar {
  order: 2;
  margin-left: 10px;
}

.message.ai .avatar {
  margin-right: 10px;
}

.message.user .text {
  background-color: #e2e8f0;
  color: #333;
}

.message.ai .text {
  background-color: #fff;
  color: #333;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.text {
  max-width: 70%;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  white-space: pre-wrap;
}

.input-box {
  display: flex;
  padding: 10px;
  background-color: #f1f5f9;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.breadcrumb {
  display: flex;
  align-items: center;
  padding: 4px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.breadcrumb-toggle {
  background: #007bff;
  border: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .chat-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .chat-window {
    height: calc(100vh - 50px);
  }

  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
