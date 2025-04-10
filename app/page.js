"use client";
import { useState } from "react";

export default function OrderPage() {
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [deliveryType, setDeliveryType] = useState("now"); // "now" or "schedule"
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setOrderNumber("");

    if (!email) {
      setMessage("メールアドレスを入力してください。");
      return;
    }
    if (quantity <= 0) {
      setMessage("注文数は1以上にしてください。");
      return;
    }

    let deliveryTime = "いますぐ希望";
    if (deliveryType === "schedule") {
      if (!scheduledTime) {
        setMessage("受け取り希望時間を入力してください。");
        return;
      }
      deliveryTime = scheduledTime;
    }

    const orderData = {
      email,
      orderItems: {
        product: "苺スムージー",
        quantity: quantity,
      },
      deliveryTime,
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (data.success) {
        setOrderNumber(data.orderNumber);
        setMessage("注文が完了しました！ ご注文内容はメールでも送信されています。");
        setEmail("");
        setQuantity(1);
        setDeliveryType("now");
        setScheduledTime("");
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
          <div className="form-group">
            <p>受け取り希望時間：</p>
            <label>
              <input
                type="radio"
                name="delivery"
                value="now"
                checked={deliveryType === "now"}
                onChange={() => setDeliveryType("now")}
              />
              いますぐ希望
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name="delivery"
                value="schedule"
                checked={deliveryType === "schedule"}
                onChange={() => setDeliveryType("schedule")}
              />
              日時を指定（9:00〜18:00）
            </label>
            {deliveryType === "schedule" && (
              <input
                type="datetime-local"
                min="09:00"
                max="18:00"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            )}
          </div>
          <button type="submit">注文する</button>
        </form>
        {message && <p className="message">{message}</p>}
        {orderNumber && <p className="order-number">注文番号: {orderNumber}</p>}
      </div>
    </div>
  );
}
