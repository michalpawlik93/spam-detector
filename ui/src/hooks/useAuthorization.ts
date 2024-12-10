import AccountsSDK from "@livechat/accounts-sdk";
import { useEffect, useState } from "react";

type AccountSdkType = {
  client_id: string;
  account_url: string;
};

export const useAuthorization = ({
  client_id,
  account_url,
}: AccountSdkType) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const accountsSDK = new AccountsSDK({
    client_id: client_id,
    server_url: account_url,
  });

  useEffect(() => {
    const authorize = async () => {
      try {
        const authorizeData = await accountsSDK.redirect().authorizeData();
        accountsSDK.verify(authorizeData);
        const { access_token } = authorizeData;
        setAccessToken(access_token);
      } catch (error) {
        console.log(error);
        await accountsSDK.redirect().authorize();
      }
    };
    authorize();
  }, []);

  return [accessToken];
};
