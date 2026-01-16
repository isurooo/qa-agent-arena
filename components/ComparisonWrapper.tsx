"use client"
import React, { useState } from 'react';
import ComparisonSimple from './ComparisonSimple';
import { verifyRun } from '@/app/actions/verify';

interface ComparisonWrapperProps {
    toolName: string;
    marketingClaims: string[];
    auditResults: {
        passRate: number;
        stabilityScore: number;
        hallucinations: number;
    };
    flakinessData: { run: number; stability: number }[];
    isAdmin: boolean;
    runId: number;
}

const ComparisonWrapper: React.FC<ComparisonWrapperProps> = ({
    toolName, 
    marketingClaims, 
    auditResults, 
    flakinessData, 
    isAdmin,
    runId
}) => {
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = async () => {
        // Call the server action
        const result = await verifyRun(runId, "AdminUser"); // Mock admin
        if(result.success) {
            setIsVerified(true);
            alert("Verification Saved!");
        } else {
            alert("Verification failed");
        }
    };

    return (
       <div>
         {isVerified && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded text-green-500 text-center font-bold">
                Verification Synced to Database
            </div>
         )}
         <ComparisonSimple 
            toolName={toolName}
            marketingClaims={marketingClaims}
            auditResults={auditResults}
            flakinessData={flakinessData}
            isAdmin={isAdmin}
            onVerify={handleVerify}
         />
       </div>
    );
}

export default ComparisonWrapper;
