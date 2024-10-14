import type {
  EmailMessage,
  SyncResponse,
  SyncUpdatedResponse,
} from "@/lib/types";
import axios from "axios";

const API_BASE_URL = "https://api.aurinko.io/v1";

class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async startSync(): Promise<SyncResponse> {
    const response = await axios.post<SyncResponse>(
      `${API_BASE_URL}/email/sync`,
      {},
      {
        headers: { Authorization: `Bearer ${this.token}` },
        params: {
          daysWithin: 2,
          bodyType: "html",
        },
      },
    );
    return response.data;
  }

  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }): Promise<SyncUpdatedResponse> {
    console.log("getUpdatedEmails", { deltaToken, pageToken });

    let params: Record<string, string> = {};

    if (deltaToken) params.deltaToken = deltaToken;
    if (pageToken) params.pageToken = pageToken;

    const response = await axios.get<SyncUpdatedResponse>(
      `${API_BASE_URL}/email/sync/updated`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
        params,
      },
    );
    return response.data;
  }

  async performInitialSync() {
    try {
      console.log("// Start the sync process");

      let syncResponse = await this.startSync(); // Sync emails from the last 7 days

      // Wait until the sync is ready
      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        syncResponse = await this.startSync();
      }

      console.log("Sync is ready. Tokens:", syncResponse);

      console.log("Perform initial sync of updated emails");

      let storedDeltaToken: string = syncResponse.syncUpdatedToken;
      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: storedDeltaToken,
      });

      // console.log("updatedResponse", updatedResponse);

      if (updatedResponse.nextDeltaToken) {
        console.log("The sync has completed up to the bookmark");
        storedDeltaToken = updatedResponse.nextDeltaToken;
      }

      let allEmails: EmailMessage[] = updatedResponse.records;

      console.log("Fetch all pages if there are more...");

      while (updatedResponse.nextPageToken) {
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });

        allEmails = allEmails.concat(updatedResponse.records);

        if (updatedResponse.nextDeltaToken) {
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }

      console.log("Initial sync complete. Total emails:", allEmails.length);

      // Store the nextDeltaToken for future incremental syncs

      // Example of using the stored delta token for an incremental sync
      // await this.performIncrementalSync(storedDeltaToken);
      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during sync:",
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        console.error("Error during sync:", error);
      }
    }
  }
}
type EmailAddress = {
  name: string;
  address: string;
};

export default Account;
