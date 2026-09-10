import { Link } from "react-router-dom";
import CompactHeader from "@/components/CompactHeader";
import StoreFooter from "@/components/StoreFooter";

type PolicyType = "privacy" | "terms" | "shipping" | "returns" | "company";

interface StorePolicyProps {
  type: PolicyType;
}

const policyContent: Record<PolicyType, { title: string; intro: string; sections: Array<[string, string[]]> }> = {
  privacy: {
    title: "Privacy Policy",
    intro: "This policy explains how Galla Caffe uses personal information submitted through this website.",
    sections: [
      ["Information we collect", ["For orders, we collect your name, email, phone number, delivery address, city, postal code, ordered items and payment method. For enquiries, we collect the information you enter in the contact form."]],
      ["Why we use it", ["We use this information to process and deliver orders, provide confirmations and customer support, prevent misuse, keep accounting records and meet legal obligations. Order processing is necessary to perform the purchase contract."]],
      ["Who receives it", ["Information is shared only when needed with hosting, database, email and delivery providers, payment providers when card payments are introduced, and authorities when legally required. We do not sell personal information or use order emails for marketing without separate consent."]],
      ["Retention and security", ["Order records are kept only as long as needed for fulfilment, accounting, disputes and applicable legal requirements. Contact enquiries are deleted when no longer needed. Appropriate access controls and technical safeguards are used."]],
      ["Your rights", ["You may request access, correction, deletion, restriction or objection where applicable by contacting us. You may also contact the Agency for Personal Data Protection of North Macedonia."]],
      ["Cookies", ["The current store uses essential browser storage for the cart and language preference. If analytics or advertising cookies are introduced, this policy and the consent controls must be updated before they are enabled."]],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "These terms apply to purchases made from the Galla Caffe online store for delivery in North Macedonia.",
    sections: [
      ["Orders", ["You must provide accurate contact and delivery information. After checkout, you receive an order number and confirmation email. We may contact you to confirm the order and may cancel an order if a product is unavailable, the information is incomplete, or fulfilment is not reasonably possible."]],
      ["Prices and payment", ["Prices are displayed in EUR and MKD. The backend-calculated MKD amount shown in the confirmation is the cash-on-delivery amount. Cash is paid to the courier in MKD. Card payments are not available until a hosted payment provider is activated."]],
      ["Products", ["We take reasonable care to describe products accurately. Packaging and images may vary without changing the essential product. Availability may change before an order is confirmed."]],
      ["Liability", ["Nothing in these terms limits rights that cannot legally be excluded. Galla Caffe is not responsible for delays caused by events outside reasonable control, but will assist customers with affected orders."]],
      ["Law and contact", ["These terms are governed by the laws of North Macedonia. Contact us first so we can try to resolve any complaint promptly."]],
    ],
  },
  shipping: {
    title: "Shipping Policy",
    intro: "Current delivery rules for capsule orders placed through this website.",
    sections: [
      ["Delivery area", ["We currently deliver only within North Macedonia. A complete street address, city and reachable phone number are required."]],
      ["Delivery time", ["Estimated delivery is 3–5 business days after confirmation. Weekends, holidays, remote areas and events outside our control may extend this estimate."]],
      ["Delivery fee", ["Delivery costs 120 MKD. Delivery is free when the backend-calculated merchandise subtotal is at least 2,150 MKD."]],
      ["Receiving an order", ["The courier may call before delivery. Please inspect the parcel for visible damage and report delivery problems to Galla Caffe as soon as possible."]],
    ],
  },
  returns: {
    title: "Returns & Refund Policy",
    intro: "We want orders to arrive correct and undamaged. This policy does not reduce mandatory consumer rights.",
    sections: [
      ["Cancellation", ["Contact us promptly with your order number if you want to cancel. An order can be cancelled before dispatch. If it has already been dispatched, return rules and delivery costs may apply."]],
      ["Returns", ["Where the statutory withdrawal right applies, notify us within 14 days of receiving the order. Products must be unused, unopened, in their original packaging and suitable for resale. Legal exceptions may apply to opened sealed goods for health or hygiene reasons and goods that deteriorate rapidly."]],
      ["Incorrect, damaged or defective goods", ["Contact us as soon as possible with the order number, description and photographs where helpful. If we confirm an incorrect, damaged or defective product, Galla Caffe will arrange an appropriate replacement, refund or other legal remedy and cover reasonable return costs."]],
      ["Refunds", ["Approved refunds are processed after the returned goods are received and checked. For cash-on-delivery orders, we will agree a suitable refund method with the customer. Processing time can depend on the selected method."]],
      ["How to request a return", ["Email minetamexhiti01@gmail.com or call +389 44 333 375. Include your order number and do not send goods back until return instructions are provided."]],
    ],
  },
  company: {
    title: "Company & Legal Details",
    intro: "Trader and store contact information.",
    sections: [
      ["Trading details", ["Trading name: Galla Caffe", "Address: Ilindenska 160, Tetovo, North Macedonia", "Email: minetamexhiti01@gmail.com", "Telephone: +389 44 333 375 / +389 71 224 557"]],
      ["Registration details requiring confirmation", ["The registered legal entity name, company registration number and tax number have not yet been supplied for this website. Galla Caffe must add and verify these details before treating this page as final legal disclosure."]],
      ["Customer complaints", ["Send complaints by email with your name, contact details, order number and a description of the issue. We will acknowledge and review the complaint as soon as reasonably possible."]],
    ],
  },
};

const StorePolicy = ({ type }: StorePolicyProps) => {
  const policy = policyContent[type];

  return (
    <div className="min-h-screen bg-[#f7f4f1] text-[#1f1f1f]">
      <CompactHeader />
      <main className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <Link to="/" className="text-sm font-semibold text-[#9e0102] hover:underline">← Back to Galla</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#9e0102]">Store information</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{policy.title}</h1>
        <p className="mt-4 text-sm leading-7 text-[#4a4a4a]">{policy.intro}</p>
        <p className="mt-2 text-xs text-[#6d6259]">Last updated: 10 September 2026</p>

        <div className="mt-10 space-y-5">
          {policy.sections.map(([heading, paragraphs]) => (
            <section key={heading} className="rounded-xl border border-[#dfd4ca] bg-white p-5 shadow-sm md:p-7">
              <h2 className="font-serif text-2xl text-[#8b1a1a]">{heading}</h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-7 text-[#424242]">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default StorePolicy;
