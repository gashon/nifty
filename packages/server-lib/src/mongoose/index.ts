import mongoose from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseExpand from './plugins/mongoose-expand';
import mongooseHidden from './plugins/mongoose-hidden';
import mongoosePaginate from './plugins/mongoose-paginate';

mongoose.plugin(mongooseAutopopulate);
mongoose.plugin(mongooseHidden);
mongoose.plugin(mongoosePaginate);
mongoose.plugin(mongooseExpand);

export default mongoose;
