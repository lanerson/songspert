from rest_framework.test import APITestCase
from django.urls import reverse
from django.utils.timezone import now, timedelta
from core.models import User, ChallengeSet, Challenge, Attempt, RandomAttempt

class RankingViewTest(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="alice", password="123")
        self.user2 = User.objects.create_user(username="bob", password="123")

        self.cs = ChallengeSet.objects.create(name="Set 1", created_by=self.user1)

        # Desafios
        ch1 = Challenge.objects.create(challenge_set=self.cs, track=111, type="title")
        ch2 = Challenge.objects.create(challenge_set=self.cs, track=222, type="title")

        # Tentativas corretas (Challenge)
        Attempt.objects.create(user=self.user1, challenge_set=self.cs, is_correct=True, score=10)
        Attempt.objects.create(user=self.user2, challenge_set=self.cs, is_correct=True, score=20)

        # Tentativas aleatórias (Random)
        RandomAttempt.objects.create(user=self.user1, track=111, score=15, tips_used=1)
        RandomAttempt.objects.create(user=self.user2, track=222, score=5, tips_used=2)

    def test_global_ranking(self):
        url = reverse("ranking")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 2)

        # Ordenação: bob (20+5=25) antes de alice (10+15=25) por ordem de inserção
        usernames = [item["username"] for item in data]
        self.assertIn("alice", usernames)
        self.assertIn("bob", usernames)

    def test_ranking_by_challenge_set(self):
        url = reverse("ranking")
        response = self.client.get(url, {"challenge_set": self.cs.id})
        self.assertEqual(response.status_code, 200)

        data = response.json()
        # random_points deve ser incluído, mas o filtro só afeta challenge_points
        for user in data:
            self.assertIn("challenge_points", user)
            self.assertIn("random_points", user)
            self.assertIn("total_points", user)
