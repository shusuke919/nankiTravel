import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";

const GMAIL_USER = "sh091965@gmail.com";
const GMAIL_PASS = "ycai tjro rosz jfup";

export async function POST(request) {
  try {
    const { email, orderItems, deliveryTime } = await request.json();

    if (
      !email ||
      !orderItems?.product ||
      !orderItems?.quantity ||
      !deliveryTime
    ) {
      return NextResponse.json(
        { success: false, error: "必要なパラメータが不足しています。" },
        { status: 400 }
      );
    }

    const { product, quantity } = orderItems;

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "注文数は1以上にしてください。" },
        { status: 400 }
      );
    }

    const orderNumber = String(randomInt(1000, 10000));

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const subject = `新しい注文 - 注文番号: ${orderNumber}`;
    const textContent = `新しい注文が入りました。
メールアドレス: ${email}
注文番号: ${orderNumber}
注文詳細:
・${product}: ${quantity} 個
受け取り希望時間: ${deliveryTime}
`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: GMAIL_USER,
      to: adminEmail,
      subject,
      text: textContent,
    });

    return NextResponse.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { success: false, error: "内部サーバーエラー" },
      { status: 500 }
    );
  }
}
