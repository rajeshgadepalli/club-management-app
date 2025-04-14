import { BaseEntity } from "./core";

export interface AgentActivitySummary extends BaseEntity{
    agentId: number;
    activityDate: Date;
    demoCount: number;
    salesOrderCount: number;
    deliveryCount: number;
    paymentCount: number;
    followupCount: number;
    dealerCount: number;
    inTime: Date;
    outTime: Date;
    isLate: boolean;
    branchId: number;
    s1Id: number;
    s2Id: number;
    s3Id: number;
    s4Id: number;
    s5Id: number;
    paymentCollected: number;
    fullDeliveryCount: number;
    partialDeliveryCount: number;
    fullReturnCount: number;
    consecutiveAbsentCount: number;
    consecutiveLateCount: number;
    consecutiveTimeoutMissedCount: number;
    absenceStartDate: Date;
    absenceEndDate: Date;
    lateStartDate: Date;
    lateEndDate: Date;
    timeoutMissedStartDate: Date;
    timeoutMissedEndDate: Date;
    pointsEarned: number;
    salesOrderValue: number;
    distanceCovered: number;
}
