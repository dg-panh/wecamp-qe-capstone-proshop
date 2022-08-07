import generateToken from '../utils/generateToken'
import User from '../models/userModel'

const getToken = async (email) => {
    const user = await User.findOne({ email: email });
    const token = generateToken(user._id);
    return token
};

const cleanup = async function (collection, id) {
    `${collection}`.deleteOne({"_id": Object(id)})
};

module.exports = {
    cleanup,
    getToken,
};