import React from 'react';
import centricLayout from '../../layouts/centricLayout';
import TcBoxContainer from '../../components/shared/TcBox/TcBoxContainer';
import TcText from '../../components/shared/TcText';
import TcButton from '../../components/shared/TcButton';
import router from 'next/router';
import useAppStore from '../../store/useStore';

function Index() {
  const { discordAuthorization } = useAppStore();
  return (
    <div>
      <TcBoxContainer
        bgcolor="white"
        className="rounded py-12 px-4 md:p-12 md:min-h-[37.5rem]"
        contentContainerChildren={
          <div className="space-y-8 py-12">
            <TcText
              sx={{ typography: { xs: 'h5', md: 'h4' } }}
              color="initial"
              fontWeight="bold"
              text="Connect your Discord"
            />
            <div className="block">
              <TcButton
                text={'Connect your Discord'}
                variant="contained"
                onClick={() => discordAuthorization()}
              />
            </div>
            <TcText
              variant="body1"
              color="initial"
              text="More log-in options comming soon."
            />
          </div>
        }
      />
    </div>
  );
}

Index.pageLayout = centricLayout;

export default Index;