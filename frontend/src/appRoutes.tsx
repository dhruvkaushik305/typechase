import { Route, Routes } from "react-router";
import LandingPage from "./pages/landing";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { WsProvider } from "./wsContext";
import GamePage from "./pages/game";

export default function AppRoutes() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 3;

    const connectWebSocket = () => {
      const newSocket = new WebSocket("ws://localhost:3000");

      newSocket.onopen = () => {
        console.log("Connected to the websocket");
        setSocket(newSocket);

        //check if there is already a userId in the localStorage
        const existingUserId = localStorage.getItem("userId");
        // send a connect event to get the userId
        const payload = {
          type: "connect",
          payload: existingUserId ? { playerId: existingUserId } : {},
        };

        newSocket.send(JSON.stringify(payload));
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const type = data.type;

        if (type === "connect") {
          const playerId = data.payload.playerId;

          if (playerId) {
            localStorage.setItem("userId", playerId);
          }
        }
      };

      newSocket.onerror = () => {
        toast.error("Something went wrong");

        if (attempts < maxAttempts) {
          attempts += 1;
          const timeout = Math.pow(2, attempts) * 1000;
          setTimeout(connectWebSocket, timeout);
        }
      };

      newSocket.onclose = () => {
        if (attempts < maxAttempts) {
          attempts += 1;
          const timeout = Math.pow(2, attempts) * 1000;
          setTimeout(connectWebSocket, timeout);
        }
      };
    };

    connectWebSocket();
  }, []);

  return (
    <WsProvider ws={socket}>
      <main className="flex h-screen w-screen flex-col">
        <Navbar />
        <Toaster richColors={true} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
      </main>
    </WsProvider>
  );
}

function Navbar() {
  return (
    <nav className="flex h-[3rem] items-center justify-between border-b border-zinc-200 px-4 py-2">
      <h1 className="font-mono text-2xl font-bold">
        Type<span className="text-blue-700">chase</span>
      </h1>
      <a
        href="https://github.com/dhruvkaushik305/typechase"
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
        target="_blank"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: "2rem", height: "2rem" }}
        >
          <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"></path>
        </svg>
      </a>
    </nav>
  );
}
