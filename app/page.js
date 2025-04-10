"use client";
import { useState } from "react";

export default function OrderPage() {
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1); // 注文数（デフォルトは1）
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setOrderNumber("");

    // 入力チェック：メールアドレス必須、注文数は1以上
    if (!email) {
      setMessage("メールアドレスを入力してください。");
      return;
    }
    if (quantity <= 0) {
      setMessage("注文数は1以上にしてください。");
      return;
    }

    // 注文情報の準備：品名は固定で「ベリースウィート苺スムージー」
    const orderData = {
      email,
      orderItems: {
        product: "苺スムージー",
        quantity: quantity,
      },
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (data.success) {
        // API側ではランダムな4桁の数字で注文番号を発行する前提です。
        setOrderNumber(data.orderNumber);
        setMessage(
          "注文が完了しました！ ご注文内容はメールでも送信されています。"
        );
        // 注文完了後、入力内容をリセット
        setEmail("");
        setQuantity(1);
      } else {
        setMessage("注文に失敗しました: " + data.error);
      }
    } catch (error) {
      console.error("注文エラー:", error);
      setMessage("エラーが発生しました。");
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <h1>苺スムージー注文受付</h1>
        {/* 商品情報エリア */}
        <div className="product-info">
          <h2>ベリースウィート苺スムージー</h2>
          <img
            style={{ maxWidth: "50%", height: "auto" }}
            src="/IMG_1859.png"
            alt="ベリースウィート苺スムージー"
          />

          <p>ご注文は複数個も可能です。ご希望の注文数を入力してください。</p>
        </div>
        <form className="order-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">メールアドレス：</label>
            <input
              type="email"
              id="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">注文数：</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <button type="submit">注文する</button>
        </form>
        {message && <p className="message">{message}</p>}
        {orderNumber && <p className="order-number">注文番号: {orderNumber}</p>}
      </div>
    </div>
  );
}
