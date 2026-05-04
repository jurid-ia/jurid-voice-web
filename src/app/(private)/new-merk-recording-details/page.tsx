"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ActionsTab } from "./components/actions-tab";
import { AnalysisTab } from "./components/analysis-tab";
import { ContactsTab } from "./components/contacts-tab";
import { HeroHeader } from "./components/hero-header";
import { InsightsTab } from "./components/insights-tab";
import { SummaryTab } from "./components/summary-tab";
import { TabNav, type TabKey } from "./components/tab-nav";
import { MOCK_RECORDING } from "./mock/recording";

export default function NewMerkRecordingDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [recording, setRecording] = useState(MOCK_RECORDING);

  return (
    <div className="flex w-full flex-col gap-6">
      <HeroHeader recording={recording} />
      <TabNav active={activeTab} onChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "summary" && <SummaryTab recording={recording} />}
          {activeTab === "actions" && (
            <ActionsTab recording={recording} setRecording={setRecording} />
          )}
          {activeTab === "contacts" && (
            <ContactsTab recording={recording} setRecording={setRecording} />
          )}
          {activeTab === "analysis" && <AnalysisTab recording={recording} />}
          {activeTab === "insights" && (
            <InsightsTab recording={recording} setRecording={setRecording} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
