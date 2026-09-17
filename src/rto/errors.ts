import { ErrorFamily } from '../error/family';
import type { ErrorCodeFamily } from '../error/types';
import type { Rec } from '../index';

type OrchestratorErrorCodeFamily = ErrorCodeFamily<'EC_RTO'>;

const OrchestratorErrorPrefix: OrchestratorErrorCodeFamily = 'EC_RTO_';

/**
 * Errors reported by the Reactive Task Orchestrator.
 *
 * Validation errors are raised while the orchestrator is being built, so a malformed graph can
 * never start executing; the rest are raised during a run.
 *
 * @see createTaskOrchestrator
 */
export const OrchestratorErrors = ErrorFamily.declare(OrchestratorErrorPrefix, {
    EC_RTO_DUPLICATE_PRODUCER: ErrorFamily.member<{
        artifact: string;
        tasks: Rec<true>;
    }>('Artifact is produced by more than one task'),

    EC_RTO_MISSING_PRODUCER: ErrorFamily.member<{
        artifact: string;
        requiredBy: Rec<true>;
    }>('Required artifact has no producer'),

    EC_RTO_CYCLIC_DEPENDENCY: ErrorFamily.member<{
        /** Ordered path of the detected cycle, first task repeated at the end */
        path: string[];
    }>('Cyclic dependency detected'),

    EC_RTO_CONFLICTING_REQUIRE: ErrorFamily.member<{
        taskId: string;
        artifact: string;
    }>('Artifact is declared both as a hard and as a soft requirement'),

    EC_RTO_CONFLICTING_OUTPUT: ErrorFamily.member<{
        taskId: string;
        artifact: string;
    }>('Artifact is declared both as a requirement and as an output of the same task'),

    EC_RTO_INVALID_TASK: ErrorFamily.member<{
        taskId: string;
        reason: string;
    }>('Task definition is invalid'),

    EC_RTO_UNDECLARED_ARTIFACT: ErrorFamily.member<{
        taskId: string;
        artifact: string;
    }>('Task produced an artifact it did not declare'),

    EC_RTO_MISSING_OUTPUT: ErrorFamily.member<{
        taskId: string;
        artifacts: Rec<true>;
    }>('Task finished without producing all the artifacts it declared'),

    EC_RTO_DEADLOCK: ErrorFamily.member<{
        waiting: Rec<true>;
        missing: Rec<true>;
    }>('Orchestration reached an unreachable state'),

    EC_RTO_RESULT_UNREACHABLE: ErrorFamily.member<{
        artifact: string;
        producer: string;
    }>('Result can no longer be computed'),

    EC_RTO_CANCELLED: ErrorFamily.member<{ reason?: string }>('Orchestration has been cancelled'),

    EC_RTO_UNKNOWN_TASK: ErrorFamily.member<{ taskId: string }>('Unknown task'),

    EC_RTO_ALREADY_RUNNING: ErrorFamily.member('Orchestration is already running'),

    EC_RTO_DISPOSED: ErrorFamily.member('Orchestrator has been disposed'),
});
