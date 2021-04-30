/** \brief evaluateStartARTPolicy determines if the starting criteria for ART has been met
 *
 * \return true if the Patient meets ART starting criteria
 **/
bool ClinicVisitUpdater::evaluateStartARTPolicy() {
    /** return false if there are no more available regimens */
    if (!patient->getARTState()->hasNextRegimenAvailable)
        return false;

    int artLineNum = patient->getARTState()->nextRegimenNum;
    const SimContext::TreatmentInputs::ARTStartPolicy &startART = simContext->getTreatmentInputs()->startART[artLineNum];

    /** return false if minimum time before starting has not yet been reached */
    if ((startART.minMonthNum != SimContext::NOT_APPL) &&
        (patient->getGeneralState()->monthNum < startART.minMonthNum)) {
            return false;
    }

    /** return false if minimum time since last regimen stop has not yet been reached */
    /** YOUR CODE HERE */
    // assume getGeneralState() & getARTState() are actually implemented in "Patient.h"
    // assume startART (above) is a valid ARTStartPolicy reference
    if (patient->getGeneralState()->monthNum <
       (patient->getARTState()->monthOfPrevRegimenStop + startART.minMonthsSincePrevRegimen)) {
            return false;
    }
    
    /** Evaluate the acute OIs since last ART only criteria */
    int numOIs = 0;
    for (int i = 0; i < SimContext::OI_NUM; i++) {
        if (startART.OIHistory[i]) {
            numOIs += patient->getARTState()->numObservedOIsSinceFailOrStopART[i];
        }
    }
    if (numOIs >= startART.numOIs)
        return true;

    return false;
} /* end evaluateStartARTPolicy */
