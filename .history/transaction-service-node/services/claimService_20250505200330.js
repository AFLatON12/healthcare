class ClaimService {
  async processClaim(claim) {
    this.validateAmount(claim.amount);
    this.validateStatus(claim.status);

    claim.status = claim.status || 'pending';
    claim.createdAt = new Date();
    claim.updatedAt = new Date();
  }

  async updateClaimStatus(claim, newStatus) {
    this.validateStatus(newStatus);

    const validTransitions = {
      pending: ['approved', 'rejected'],
      approved: ['paid', 'rejected'],
      rejected: [],
      paid: [],
    };

    if (!this.isValidTransition(claim.status, newStatus, validTransitions)) {
      throw new Error('Invalid status transition');
    }

    claim.status = newStatus;
    claim.updatedAt = new Date();
  }

  async rejectClaim(claim) {
    if (claim.status === 'rejected') {
      throw new Error('Claim is already rejected');
    }
    claim.status = 'rejected';
    claim.updatedAt = new Date();
  }

  isValidTransition(currentStatus, newStatus, validTransitions) {
    const allowed = validTransitions[currentStatus];
    if (!allowed) return false;
    return allowed.includes(newStatus);
  }

  validateAmount(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount');
    }
  }

  validateStatus(status) {
    const validStatuses = ['pending', 'approved', 'rejected', 'paid'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid claim status');
    }
  }
}

module.exports = ClaimService;
