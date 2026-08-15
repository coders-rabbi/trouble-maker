interface SummaryDetails {
  price: number;
  count: number;
  couponDiscount: number;
  deliveryCharge?: number;
}

const Ordersummary = ({
  price,
  count,
  couponDiscount,
  deliveryCharge,
}: SummaryDetails) => {
  const total =
    price * count +
    (deliveryCharge !== undefined ? deliveryCharge : 0) -
    couponDiscount;

  return (
    <div className="rounded-2xl bg-[#F5F5F7] p-5">
      <h2 className="text-2xl font-bold">MY ORDER</h2>

      <hr className="mt-2.5 border-gray-300" />

      <div className="mt-8 flex justify-between">
        <p>Sub Total</p>
        <p>{(price * count).toFixed(2)}৳</p>
      </div>

      <div className="mt-2 flex justify-between">
        <p>Delivery Service</p>
        <p>
          {deliveryCharge !== undefined ? deliveryCharge.toFixed(2) : "0.00"}৳
        </p>
      </div>

      <div className="mt-2 flex justify-between">
        <p>Discount</p>
        <p>{couponDiscount ? couponDiscount.toFixed(2) : "0.00"}৳</p>
      </div>

      <hr className="mt-5 border-gray-300" />

      <div className="mt-2 flex justify-between">
        <p className="font-semibold">Total</p>
        <p>Taka: {total}৳</p>
      </div>
    </div>
  );
};

export default Ordersummary;
