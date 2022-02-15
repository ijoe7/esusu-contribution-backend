const Group = require('../models/group');
const Contribution = require('../models/contribution');
const User = require('../models/user');
const helper = require('../config/helper');

exports.createGroup = async (req, res) => {
    const { error } = validateGroup(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const { groupName, members, private } = req.body;
        const groupNameExists = await Group.findOne({ groupName });
        if (groupNameExists) return res.status(400).send("Group name already exists");
        const uniqueKey = helper.generateOTCode();
        console.log(req.user)
        const newGroup = {
            groupName,
            admin: req.user,
            members: members ? members : [],
            private,
            uniqueKey
        }
        const group = await Group.create(newGroup);
        res.status(201).json({
            status: "success",
            message: "Successfully created group",
            group
        });
    } catch (error) {
        return res.status(400).json({ message: "Group already exists" });
    }
};

exports.searchPublicGroups = async (req, res) => {
    try {
        const groups = await Group.find({ private: false });
        if (!groups) return res.status(400).send("No Public groups found");
        res.status(200).json({
            status: "success",
            message: "Successfully found Public groups",
            groups
        });
    } catch (error) {
        return res.status(400).json({ message: "Error finding groups" });
    }
};

exports.getUserGroups = async (req, res) => {
    try {
        console.log(req.user)
        const groups = await Group.find({ members: {$in: [req.user]} }).select('-amount');
        if (!groups) return res.status(400).send("No groups found");
        res.status(200).json({
            status: "success",
            message: "Successfully found groups",
            groups
        });
    } catch (error) {
        return res.status(400).json({ message: "Error finding groups" });
    }
};

exports.getListOfMembersInGroup = async (req, res) => {
    try {
            const groupMembers = await Group.findById(req.params.id)
            .populate({
                path: 'members',
                model: 'user'
            }).populate({
                path: 'contributions',
                model: 'contribution'
            })
            if (!groupMembers) return res.status(400).send("Group not found");
            if (groupMembers.admin !== req.user) return res.status(400).send("You are not the admin of this group");
            res.status(200).json({
                status: "success",
            message: "Successfully found members",
            members: groupMembers
        });
    } catch (error) {
        return res.status(400).json({ message: "Error finding members" });
    }
};


exports.addMemberToGroup = async (req, res) => {
    try {
        const { groupId, userId, amount } = req.body;
        const group = await Group.findById(groupId);
        if (!group) return res.status(400).send("Group not found");
        if (group.private === true) {
            if (group.admin !== req.user) return res.status(400).send("You are not the admin of this group");
        }
        // const { members } = req.body;
        // group.members = members;
        // await group.save();
        const userExists = await User.findById(userId);
        if (!userExists) return res.status(400).send("User not found");
        let updateGroupMember;
        if (amount) {
            const createContribution = await Contribution.create({
                user: userId,
                group: groupId,
                amount
            });
            updateGroupMember = await Group.findByIdAndUpdate(groupId, {
                $push: {
                    members: userId,
                    contributions: createContribution._id
                },
                $inc: {
                    totalAmount: amount
                }
            }, { new: true });
        } else {
            updateGroupMember = await Group.findByIdAndUpdate(groupId, { $push: { members: userId } }, { new: true });
        }

        res.status(200).json({
            status: "success",
            message: "Successfully added member to group",
            group
        });
    } catch (error) {
        return res.status(400).json({ message: "Error adding member to group" });
    }
};

exports.contributeAmountToGroup = async (req, res) => {
    try {
        const { groupId, amount } = req.body;
        const group = await Group.findById(groupId);
        if (!group) return res.status(400).send("Group not found");
        if (group.private === true) {
            if (group.admin !== req.user) return res.status(400).send("You are not the admin of this group");
        }
        const checkUserContribution = await Contribution.findOne({ user: req.user, group: groupId });
        let contribution;
        if (!checkUserContribution) {
            contribution = await Contribution.create({
                user: req.user,
                group: groupId,
                amount
            });
        } else {
            contribution = await Contribution.findByIdAndUpdate(checkUserContribution._id, { amount }, { new: true });
        }
        
        const updateGroup = await Group.findByIdAndUpdate(groupId, {
            $push: {
                contributions: contribution._id
            },
            $inc: {
                totalAmount: amount
            }
        }, { new: true });
        res.status(200).json({
            status: "success",
            message: "Successfully contributed to group",
            group: updateGroup
        });
    } catch (error) {
        return res.status(400).json({ message: "Error contributing to group" });
    }
};