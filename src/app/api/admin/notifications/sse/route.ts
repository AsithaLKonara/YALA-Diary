import { NextRequest } from "next/server";
import { notificationEmitter } from "@/lib/emitter";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Simple auth check for SSE
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "STAFF")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: "CONNECTED" })}\n\n`);

      const onNotification = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      notificationEmitter.on("new-notification", onNotification);

      // Keep connection alive
      const keepAlive = setInterval(() => {
        controller.enqueue(`:\n\n`);
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        notificationEmitter.off("new-notification", onNotification);
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
