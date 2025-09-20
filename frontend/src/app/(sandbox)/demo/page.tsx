import DemoContainer from "./container";
import CheckoutContainer from "./checkout-container";

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          XRPL Credential Demo
        </h1>
        <DemoContainer />
        <CheckoutContainer />
      </div>
    </div>
  );
}
