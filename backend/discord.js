const { request  } = require('undici');
const mongodb = require('./database')
const mongoose = require('mongoose')

const { clientId, clientSecret, port } = require('./config/discord.json');

async function link(code, account) {
    try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: `http://localhost:${port}/game`,
                scope: 'identify',
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const oauthData = await tokenResponseData.body.json();
        
        // console.log(oauthData);

        const userResult = await request('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            },
        });

        const user = await userResult.body.json();

        mongodb.models.Account.findOne({ _id: account, discordId: { $exists: false } }).then(async (result) => {
            if (result == null) return

            const session = await mongoose.startSession();
            session.startTransaction();
    
            try {
                const discordUser = await mongodb.models.DiscordUser.collection.insertOne({
                    token: {
                        auth: oauthData.access_token,
                        refresh: oauthData.refresh_token,
                        expires_in: oauthData.expires_in
                    },
                    snowflake: user.id,
                    username: user.username,
                    discriminator: user.discriminator,
                    global_name: user.global_name,
                    avatar: user.avatar,
                    mfa_enabled: user.mfa_enabled,
                    banner: user.banner,
                    accent_color: user.accent_color,
                    locale: user.locale,
                    premium_type: user.premium_type
                })
    
                await mongodb.models.Account.updateOne({ _id: account }, { discordId: discordUser.insertedId }, { session: session });
        
                await session.commitTransaction();
                session.endSession();
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
            }
    
        })
    } catch (error) {
        // NOTE: An unauthorized token will not throw an error
        // tokenResponseData.statusCode will be 401
        console.error(error);
    }
}

module.exports = {
    link
}