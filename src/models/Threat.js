import mongoose from 'mongoose';

const ThreatLogSchema = new mongoose.Schema({
    report: Object,
    threatAnalysis: String,
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.ThreatLog || mongoose.model('ThreatLog', ThreatLogSchema);
