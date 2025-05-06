const { ObjectId } = require('mongodb');
const { getDB } = require('../db/mongodb');
const ClaimService = require('../services/claimService');

class ClaimController {
  constructor(db) {
    this.db = db;
    this.service = new ClaimService();
  }

  async createClaim(claimData) {
    const collection = this.db.collection('claims');
    // Validate and process claim
    await this.service.processClaim(claimData);

    // Set new ObjectId
    claimData._id = new ObjectId();

    // Insert into DB
    await collection.insertOne(claimData);

    return claimData;
  }

  async getClaim(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid claim ID format');
    }
    const claim = await this.db.collection('claims').findOne({ _id: new ObjectId(id) });
    return claim;
  }

  async updateClaim(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid claim ID format');
    }

    const existingClaim = await this.db.collection('claims').findOne({ _id: new ObjectId(id) });
    if (!existingClaim) {
      return null;
    }

    if (updateData.status && updateData.status !== existingClaim.status) {
      await this.service.updateClaimStatus(existingClaim, updateData.status);
    }

    const updateFields = {
      status: updateData.status || existingClaim.status,
      amount: updateData.amount || existingClaim.amount,
      description: updateData.description || existingClaim.description,
      updatedAt: new Date(),
    };

    const result = await this.db.collection('claims').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return true;
  }

  async listClaims(filters) {
    const query = {};

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    if (filters.patient_id) {
      query.patient_id = filters.patient_id;
    }

    const claims = await this.db.collection('claims').find(query).toArray();
    return claims;
  }

  async rejectClaim(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid claim ID format');
    }

    const existingClaim = await this.db.collection('claims').findOne({ _id: new ObjectId(id) });
    if (!existingClaim) {
      return null;
    }

    await this.service.rejectClaim(existingClaim);

    const result = await this.db.collection('claims').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'rejected', updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return true;
  }
}

module.exports = ClaimController;
