//how fundraiser data is stored
import {Schema, model, Document, Types} from 'mongoose';

//extending document so typescript knows this is mongoose doc
export interface IFundraiser extends Document {
    clubName: string;
    fundraiserName: string;
    location: string;
    dateTime: Date;
    proceedsInfo?: string; //optional info how proceeds are distributed
    instagramLink: string; 
    flyerImage: string;
    createdBy?: Types.ObjectId; //optional reference to the user who created it; uses MongoDB’s ObjectId
}

//defining mongoose schema - actual struct to store fundraiser docs in MongoDB
const fundraiserSchema = new Schema<IFundraiser>({
    clubName: { type: String, required: true },
    fundraiserName: { type: String, required: true },
    location: { type: String, required: true },
    dateTime: { type: Date, required: true },
    proceedsInfo: { type: String },
    instagramLink: { type: String },
    flyerImage: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default model<IFundraiser>('Fundraiser', fundraiserSchema);
//create and export the mongoose model 'Fundraiser'


