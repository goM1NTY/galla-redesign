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
    intro: "This Privacy Policy describes the personal information collected through the Galla Caffe website, the purposes for which it is used, and how to contact us about your information.",
    sections: [
      ["Personal information collected", ["When you place an order, we collect your name, email address, telephone number, delivery address, city, postal code, order details and selected payment method. When you submit an enquiry, we collect the contact details and message you provide."]],
      ["Purposes of processing", ["Personal information is used to process and deliver orders, send order confirmations, respond to enquiries, provide customer support and prevent misuse of the website. It is also used to maintain accounting records and meet applicable legal obligations. Processing order information is necessary to fulfil the purchase contract."]],
      ["Disclosure to service providers", ["Personal information is shared with hosting, database, email and delivery providers only as necessary to provide their services. If card payments are introduced, relevant information will also be shared with the payment provider. Information may be disclosed to public authorities where required by law. We do not sell personal information or use email addresses supplied for orders for marketing without separate consent."]],
      ["Data retention and security", ["Order records are retained for as long as necessary for order fulfilment, accounting, the handling of disputes and applicable legal requirements. Enquiry records are deleted when they are no longer needed. Access controls and technical safeguards are used to protect personal information."]],
      ["Requests concerning personal information", ["To request access to or correction of your personal information, request its deletion, or seek restriction of or object to its processing where applicable, contact info@gallacaffe.com. You may also contact the Agency for Personal Data Protection of North Macedonia."]],
      ["Cookies and analytics", ["The store uses essential browser storage for the cart, language preference and consent choice. Optional Google Analytics is disabled unless you select Accept in the consent notice. If accepted, analytics helps us understand page visits and usage. You can change your choice through Privacy settings in the website footer. We do not enable advertising cookies through this control."]],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "These terms apply to purchases made from the Galla Caffe online store for delivery in North Macedonia.",
    sections: [
      ["Orders", ["You must provide accurate contact and delivery information. After checkout, you receive an order number and confirmation email. We may contact you to confirm the order and may cancel an order if a product is unavailable, the information is incomplete, or fulfilment is not reasonably possible."]],
      ["Prices and payment", ["Prices are displayed in EUR and MKD. The MKD amount shown in the confirmation is the cash-on-delivery amount. Cash is paid to the courier in MKD."]],
      ["Products", ["We take reasonable care to describe products accurately. Packaging and images may vary without changing the essential product. Availability may change before an order is confirmed."]],
      ["Liability", ["Nothing in these terms limits rights that cannot legally be excluded. Galla Caffe is not responsible for delays caused by events outside reasonable control, but will assist customers with affected orders."]],
      ["Applicable law and complaints", ["These terms are governed by the laws of North Macedonia. Complaints concerning an order may be submitted to info@gallacaffe.com. Please include your order number and a description of the issue so that we can review your complaint."]],
    ],
  },
  shipping: {
    title: "Shipping Policy",
    intro: "Current delivery rules for capsule orders placed through this website.",
    sections: [
      ["Delivery area", ["We currently deliver only within North Macedonia. A complete street address, city and reachable phone number are required."]],
      ["Delivery time", ["Estimated delivery is 3–5 business days after confirmation. Weekends, holidays, remote areas and events outside our control may extend this estimate."]],
      ["Delivery fee", ["Delivery costs 120 MKD. Delivery is free when the merchandise subtotal is at least 2,150 MKD."]],
      ["Receiving an order", ["The courier may call before delivery. Please inspect the parcel for visible damage and report delivery problems to Galla Caffe as soon as possible."]],
    ],
  },
  returns: {
    title: "Returns & Refund Policy",
    intro: "This policy sets out the procedures for order cancellation, returns and refunds. It does not limit mandatory consumer rights.",
    sections: [
      ["Cancellation", ["Contact us promptly with your order number if you want to cancel. An order can be cancelled before dispatch. If it has already been dispatched, return rules and delivery costs may apply."]],
      ["Returns", ["Where the statutory withdrawal right applies, notify us within 14 days of receiving the order. Products must be unused, unopened, in their original packaging and suitable for resale. Legal exceptions may apply to opened sealed goods for health or hygiene reasons and goods that deteriorate rapidly."]],
      ["Incorrect, damaged or defective goods", ["Contact us as soon as possible with your order number, a description of the issue and photographs where helpful. If we confirm an incorrect, damaged or defective product, The Galla Caffe team will arrange an appropriate replacement, refund or other legal remedy and cover reasonable return costs."]],
      ["Refunds", ["Approved refunds are processed after the returned goods are received and checked. For cash-on-delivery orders, we will agree a suitable refund method with the customer. Processing time can depend on the selected method."]],
      ["How to request a return", ["Email info@gallacaffe.com or call +389 72 234 706. Include your order number and do not send goods back until return instructions are provided."]],
    ],
  },
  company: {
    title: "Company & Legal Details",
    intro: "Business contact details and information for customer enquiries and complaints.",
    sections: [
      ["Trading details", ["Trading name: Galla Caffe", "Address: North Macedonia", "Email: info@gallacaffe.com", "Telephone: +389 72 234 706"]],
      ["Customer complaints procedure", ["Submit complaints to info@gallacaffe.com, including your name, contact details, order number where applicable, and a clear description of the issue. Please attach relevant photographs or supporting documents where helpful. We will acknowledge receipt and review the information provided as soon as reasonably possible. If further details are required, we will contact you using the contact information supplied."]],
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
        <p className="mt-2 text-xs text-[#6d6259]">Last updated: 10 October 2026</p>

        <div className="mt-10 border-t border-[#dfd4ca]">
          {policy.sections.map(([heading, paragraphs]) => (
            <section key={heading} className="border-b border-[#dfd4ca] py-7 md:py-8">
              <h2 className="font-serif text-2xl text-[#25211e]">{heading}</h2>
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
