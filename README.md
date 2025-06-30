# 📄 README.md – Semantic Email Router

### 🧠 **App Name:** Semantic Email Router

### 🏷 **Tagline:** From Unstructured Emails to Structured Intelligence — Grounded in Your Data

---

## 📌 Executive Summary

**Semantic Email Router** is a modular demo app that:

* Accepts **pasted email content** (e.g., customer orders, job requests).
* Leverages **reinforcement-learned AI agents** to **semantically parse and tag** the content.
* Extracts structured data for export to systems like **HubSpot**, **Salesforce**, or **SharePoint**.
* Provides a **Knowledge Base** tab to ground LLM understanding in fact-based documents (Excel, PDF, DOCX).
* Includes an **Admin tab** for **Outlook, SharePoint, and CRM integration** via **BYO API key** fields.
* Showcases **growing OGI (Organizational Graph Intelligence)** via iterative agent feedback and corrections.

---

## 🔍 Key Use Cases

| Company            | Use Case                                                             |
| ------------------ | -------------------------------------------------------------------- |
| Penn Stainless     | Customer sends product order via email                               |
| Tiny's Demolition  | Customer sends job request or quote inquiry                          |
| Internal Ops Teams | Tag, archive, and route unstructured email content to proper systems |

---

## 🔧 App Tabs and Features

---

### 1️⃣ **Email Analyzer**

**User Workflow**:

1. Paste in an email.
2. Click **“Analyze Email”**.
3. See structured extraction:

   * **Intent** (e.g., order, job request)
   * **Entities** (product, quantity, dates)
   * **Suggested Routing Tags** (e.g., SharePoint folder, urgency)
   * **Knowledge Match Source**
   * **Confidence Scores**

**UI Components**:

* `Textarea` (for email body)
* `Button` – “Analyze”
* `Accordion` or `Tabs` to view:

  * **Extracted Fields**
  * **Tag Suggestions**
  * **Raw JSON Output** for export

**Backend Logic**:

* Pipeline of 3–5 agents:

  1. **Intent Detector**
  2. **Entity Extractor**
  3. **Product Matcher (RAG)**
  4. **Tag Suggestion Agent**
  5. **Structured Output Generator**

---

### 2️⃣ **Knowledge Base**

**Purpose**: Upload factual documents to ground semantic analysis.

**Features**:

* Drag-and-drop upload for:

  * Excel (product catalog)
  * PDF (specs)
  * Word Docs (SOW, FAQs)
* Vector embedding and semantic chunking
* Chunk explorer: see embedded content
* Search bar for testing retrievals

**Backend Stack**:

* `unstructured.io` for parsing
* `LangChain`/`LlamaIndex` for RAG
* `Chroma`, `Pinecone`, or `Supabase PGVector` for embeddings

---

### 3️⃣ **Admin / Integrations Tab**

**Purpose**: Set up connections to email systems (inbound) and target systems (outbound).

**Sections**:

#### 🔑 API Keys Section

* Outlook 365 / Gmail → read incoming email
* SharePoint → archive email + attachments
* Salesforce / Hubspot → push extracted metadata
* S3 / Blob → optional export destination

**UI**:

* `InputField + EyeToggle` for each API key (Lucide icons: Mail, Folder, UploadCloud, Database)

#### 🔌 MCP Integration Blocks (Modular)

* Outlook: webhook or Graph API (mail.read)
* SharePoint: REST or Graph API (file.create)
* HubSpot: contacts and engagement API
* Salesforce: REST for custom object creation

---

### 4️⃣ **Developer Guide Tab (for Demo Only)**

This modal or tab is meant to help internal engineers or POCs understand **how this app works**, and how to **customize it for a customer POC**.

#### 👨‍💻 Developer Considerations

| Component                  | Notes                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Agents**                 | Consider modular `CrewAI`/`LangGraph` agent chains for parsing, classification, matching, and routing.          |
| **Reinforcement Learning** | Allow tagging corrections by the user to be stored and retrained into fine-tuning loop (or logged as feedback). |
| **Document Grounding**     | Use small chunk size (256–512 tokens), cosine similarity >0.75 for confident matches.                           |
| **Scalability**            | RAG-based systems should implement fallback when no high-confidence match is found.                             |
| **Security**               | API key storage should be encrypted; suggest `.env` or Supabase secure vault.                                   |
| **Logging**                | Output agent traces in dev mode for debugging.                                                                  |

#### 🔁 Future Enhancements

* **Automated email polling** from connected Outlook inbox.
* **Auto-attachment parsing** for documents included in email.
* **SharePoint folder detection** based on tags (e.g., product type → folder path).
* **Feedback loop** to improve tagging accuracy over time (RLHF pattern).

---

## 🧪 Example Email Flow

> *“Hi, I’d like to place an order for 304 Stainless Sheet, 4x8ft, 100 units. Please confirm pricing and availability.”*

**Output**:

```json
{
  "intent": "Order Request",
  "entities": {
    "product": "304 Stainless Sheet",
    "dimensions": "4x8 ft",
    "quantity": "100"
  },
  "tags": {
    "urgency": "Normal",
    "storage_target": "SharePoint/Penn/Orders/2025",
    "product_line": "Sheet"
  },
  "matched_from": "2025_Penn_Catalog.xlsx, Row 57",
  "confidence": 0.91
}
```

---

## 🔨 Recommended Stack

| Layer                | Technology                                                 |
| -------------------- | ---------------------------------------------------------- |
| **Frontend**         | React + Tailwind (Bolt or custom) + `lucide-react` icons   |
| **Backend**          | Supabase or Node.js w/ Express                             |
| **AI Agents**        | LangChain, CrewAI, or LangGraph                            |
| **LLM API**          | OpenAI (GPT-4), Bedrock Claude/Command                     |
| **Document Parsing** | `unstructured.io`, `pdfplumber`, `pandas`, `docx`          |
| **Vector Store**     | Chroma, PGVector (Supabase), Pinecone                      |
| **Integration APIs** | Microsoft Graph (Outlook, SharePoint), HubSpot, Salesforce |

---

## ✅ Success Criteria for Demo

* End-to-end workflow from email paste to structured extraction.
* Grounded results referencing uploaded documents.
* Simulated integration readiness via Admin tab (API keys + endpoint test).
* Usability for non-technical ops staff, and transparency for devs.
