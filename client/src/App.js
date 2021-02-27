import { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Heading,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

function App() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:5500/api/socket');

    socket.on('newScore', latestScores => {
      console.log(latestScores);
      setScores(latestScores);
    });

    const fetchScores = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5500/api/leaderboard'
        );

        setScores(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchScores();
  }, []);

  const fetchLatestScores = () => {
    if (scores.length === 0) {
      return (
        <>
          <p>Loading...</p>
        </>
      );
    }

    return (
      <Box>
        <Container>
          <Heading as='h1' size='lg'>
            Leaderboard
          </Heading>

          <Table size='md'>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th isNumeric>Score</Th>
                <Th isNumeric>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {scores.map(score => (
                <Tr key={score._id}>
                  <Td>{score.userId}</Td>
                  <Td>{score.username}</Td>
                  <Td>{score.score}</Td>
                  <Td>{dayjs(score.createdAt).format('YYYY:MM:DD')}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Box>
    );
  };

  return fetchLatestScores();
}

export default App;
