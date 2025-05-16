import { SoarProgram, GameType, Genre } from "@magicblock-labs/soar-sdk";
import { Keypair } from "@solana/web3.js";

export async function createAmocaClimateChallenge(connection: any, defaultPayer: any, auths: Keypair[]) {
    const client = SoarProgram.getFromConnection(connection, defaultPayer);

    const game = Keypair.generate();
    const title = "AMOCA Climate Challenge";
    const description = "A blockchain-powered game for real-world climate action.";
    const genre = Genre.Education; // Set the genre to Education
    const gameType = GameType.Web;
    const nftMeta = Keypair.generate().publicKey; // Placeholder for NFT metadata
    const _auths = auths.map((keypair) => keypair.publicKey);

    // Retrieve the bundled transaction to initialize the game
    const { newGame, transaction } = await client.initializeNewGame(
        game.publicKey,
        title,
        description,
        genre,
        gameType,
        nftMeta,
        _auths
    );

    // Send and confirm the transaction with the game keypair as signer
    await web3.sendAndConfirmTransaction(connection, transaction, [game]);

    console.log("AMOCA Climate Challenge game created:", newGame);
    return newGame;
}